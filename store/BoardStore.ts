//creating a board store to use with Zustand
// Typings used like BoardState can be found in typings.d.ts
import { create } from 'zustand'
import React from 'react';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;

}

export const useBoardStore = create<BoardState>()((set, get) => ({
    board: {
        columns: new Map<TypedColumn, Column>(),
    },
    getBoard: async ()=>{
        //this function and some others used can be found in lib folder in root
        const board = await getTodosGroupedByColumn();
        //This will set the global state
        set({ board });

    },
    // create setBoard State
    // Take board passed and set to global state
    setBoardState: (board) => set({board})


}))

