//creating a board store to use with Zustand
// Typings used like BoardState can be found in typings.d.ts
import { create } from "zustand";
import React from "react";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { ID, databases, storage } from "@/appwrite";
import uploadImage from "@/lib/uploadImage";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  addTask: (todo: string, columnID: TypedColumn, image?: File | null) => void;
  updateTodoInDB: (todo: Todo, id: TypedColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  deleteTodo: (taskIndex: number, todo: Todo, columnID: TypedColumn) => void;
  newTaskInput: string;
  setNewTaskInput: (input: string) => void;
  //   adding new tasks with modal
  newTaskType: TypedColumn;
  setNewTaskType: (columnId: TypedColumn) => void;
  //   handling image upload
  image: File | null;
  setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>()((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  // Default value of search string
  searchString: "",
  newTaskInput: "",
  image: null,
  //   default newTaks type is a "todo"
  newTaskType: "todo",

  // setter to change value of search string
  setSearchString: (searchString) => set({ searchString }),

  getBoard: async () => {
    //this function and some others used can be found in lib folder in root
    const board = await getTodosGroupedByColumn();
    //This will set the global state
    set({ board });
  },
  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
  setImage: (image: File | null) => set({ image }),
  addTask: async (todo: string, columnID: TypedColumn, image?: File | null) => {
    // check if there's an image
    let file: Image | undefined;
    // if there's an image
    if (image) {
      const fileUploaded = await uploadImage(image);
      // check if file was uploaded successfully , then store it in "file"
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }
    // create a document: Document ID,	title,	status, and	image. Basically how a todo is styled in my DB
    // destructure the response and get the id back
    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnID,
        // if there's an image, add it
        ...(file && { image: JSON.stringify(file) }),
      }
    );
    
    // reset the task input so it's blank on next open
    set({ newTaskInput: "" });

    // make the front end react accordingly by replacing columns ->
    set((state) => {
      const newColumns = new Map(state.board.columns);
      // grab the todo that we would've added
      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnID,
        // include image if it exists
        ...(file && { image: file }),
      };
      // if there was no column, set the column id, then add todo. other get column id and push it in
      const column = newColumns.get(columnID);
      if (!column) {
        newColumns.set(columnID, {
          id: columnID,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnID)?.todos.push(newTodo);
      }
      
      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },

  updateTodoInDB: async (todo, columnID) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      // updated information ->
      {
        title: todo.title,
        status: columnID,
      }
    );
  },
  deleteTodo: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    // copy the current map from the current state in zustand with get
    const newColumns = new Map(get().board.columns);
    // delete todo task from new column
    newColumns.get(id)?.todos.splice(taskIndex, 1);
    // replace the columns in board with modified columns
    set({ board: { columns: newColumns } });
    // if there's an image, delete the image
    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }
    // call to delete document from app write
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },

  // create setBoard State
  // Take board passed and set to global state
  setBoardState: (board) => set({ board }),
}));
