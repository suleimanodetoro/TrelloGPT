"use client";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from "react";
import Column from "./Column";


function Board() {
    const [board, getBoard] = useBoardStore(
        (state) => [
            state.board,
            state.getBoard,
          ]
        );
      
    useEffect(() => {
        getBoard();
        // call getBoard and give access to this data all around the application. We will use zustand instead of redux for this...
    }, [getBoard])
    
    console.log(board);
    const handleOnDragEnd = (result: DropResult)=>{
        return console.log('Hello world');
        

    }
    
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
        {/* You have to give the droppable an ID and then a direction */}
        <Droppable droppableId='board' direction='horizontal' type='column'>
            {/* Access child of this component to  render column */}
            {(provided) => (
                <div
                className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
                // The following is hwo DnD knows whats going on with moving parts ->
                {...provided.droppableProps}
                ref={provided.innerRef}

                >
                    {/* Rendering all columns. Because you can't loop through a map easily, you will have to change it to an array */}
                    {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}


                </div>
            )}

        </Droppable>

    </DragDropContext>
  )
}

export default Board