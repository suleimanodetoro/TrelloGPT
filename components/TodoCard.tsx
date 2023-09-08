"use client";

import { XCircleIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useEffect, useState } from "react";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";
type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

function TodoCard({
  index,
  id,
  todo,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
        <div className="flex items-center justify-between p-5">
            {/* Task title */}
            <p>{todo.title}</p>
            {/* delete task button */}
            <button className="text-red-500 hover:text-red-800">
                {/* "X" ICON */}
                <XCircleIcon className="ml-5 h-8 w-8"/>
            </button>
        </div>
    </div>
  );
}

export default TodoCard;
