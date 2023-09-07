import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Board() {
  return (
    <DragDropContext>
        {/* You have to give the droppable an ID and then a direction */}
        <Droppable droppableId='board' direction='horizontal' type='column'>
            {/* Access child of this component to  render column */}
            {(provided) => (
                <div>
                    {/* Rendering all columns */}

                </div>
            )}

        </Droppable>

    </DragDropContext>
  )
}

export default Board