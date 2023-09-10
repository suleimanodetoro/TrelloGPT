//creating a board store to use with Zustand
// Typings used like BoardState can be found in typings.d.ts
import { create } from 'zustand'
import React from 'react';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import { databases } from '@/appwrite';

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo:Todo, columnID: TypedColumn)=>void;
    searchString: string;
    setSearchString: (searchString: string)=> void;

}

export const useBoardStore = create<BoardState>()((set, get) => ({
    board: {
        columns: new Map<TypedColumn, Column>(),
    },
    // Default value of search string
    searchString:"",
    // setter to change value of search string
    setSearchString: (searchString) => set({searchString}),


    getBoard: async ()=>{
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
            },
            );
    },
        
 
    // create setBoard State
    // Take board passed and set to global state
    setBoardState: (board) => set({ board }),


}))

