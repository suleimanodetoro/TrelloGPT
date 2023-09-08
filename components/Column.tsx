import { type } from "os";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

interface Props {
  id: TypedColumn;
  todos: Todo[];
  index: number;
}

//use this to convert column text(id) to better form
const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};
function Column({ id, todos, index }: Props) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {/* render nested droppable that is draggablew */}
          <Droppable droppableId={index.toString()} type="card">
            {/* Snapshot element is used to know when you are dragging elements over to another card - turning green, red etc */}
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`pb-2 p-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? "bg-green-700" : "bg-white/50"
                }`}
              >
                <h2 className="flex justify-between font-bold text-xl p-2">
                  {idToColumnText[id]} {/*  */}
                  <span className="text-gray-500 bg-grey-200 rounded-full px-2 py-1 text-sm font-normal"></span>
                </h2>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default Column;
