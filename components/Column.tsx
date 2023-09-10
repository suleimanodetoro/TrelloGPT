import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { type } from "os";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import { useBoardStore } from "@/store/BoardStore";

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
  const [searchString] = useBoardStore((state) => [state.searchString]);
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {/* render nested droppable that is draggable */}
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
                {/* ToDo item under */}
                <div className="space-2">
                  {/* ToDo Card that is  a draggable element */}
                  {/* conditionally check if there is as string string, if so filter and map through todos that match the string, else just map as regular */}

                  {todos.map((todo, index) => {
                    if (
                      searchString &&
                      !todo.title
                        .toLowerCase()
                        .includes(searchString.toLocaleLowerCase())
                    ) {
                      return null; // Skip rendering this todo
                    }

                    return (
                      <Draggable
                        key={todo.$id}
                        draggableId={todo.$id}
                        index={index}
                      >
                        {(provided) => (
                          <TodoCard
                            todo={todo}
                            index={index}
                            id={id}
                            innerRef={provided.innerRef}
                            draggableProps={provided.draggableProps}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    );
                  })}
                  {/* After rendering all above, create space to accommodate when cards move after */}
                  {provided.placeholder}
                  {/* Below is the modal button to add a todo */}
                  <div className="flex items-end justify-end p-2">
                    <button className="text-green-500 hover:text-green-800">
                      <PlusCircleIcon className="h-10 w-10 " />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default Column;
