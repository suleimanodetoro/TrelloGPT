//creating a board store to use with Zustand
// Typings used like BoardState can be found in typings.d.ts
import { create } from "zustand";
import React from "react";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { databases, storage } from "@/appwrite";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, id: TypedColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  deleteTodo: (taskIndex: number, todo: Todo, columnID: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>()((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  // Default value of search string
  searchString: "",
  // setter to change value of search string
  setSearchString: (searchString) => set({ searchString }),

  getBoard: async () => {
    //this function and some others used can be found in lib folder in root
    const board = await getTodosGroupedByColumn();
    //This will set the global state
    set({ board });
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
    )
  },

  // create setBoard State
  // Take board passed and set to global state
  setBoardState: (board) => set({ board }),
}));
