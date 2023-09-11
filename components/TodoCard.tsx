"use client";

import getUrl from "@/lib/getUrl";
import { useBoardStore } from "@/store/BoardStore";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
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
  const deleteTodo = useBoardStore((state) => state.deleteTodo);
  // state to store and update image on card
  const [imageUrl,setImageUrl]= useState<string | null>(null);

  // when todo card mounts, check if todo image exists, fetch
  useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getUrl(todo.image!);
        if (url) {
          setImageUrl(url.toString());
        }
      };
      fetchImage();
    }
  }, [todo]);

  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md mt-2"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
        <div className="flex items-center justify-between p-5 mb-2">
            {/* Task title */}
            <p>{todo.title}</p>
            {/* delete task button */}
            <button onClick={() => deleteTodo(index, todo, id)} className="text-red-500 hover:text-red-800">
                {/* "X" ICON */}
                <XCircleIcon className="ml-5 h-8 w-8"/>
            </button>
        </div>
        {/* Show image if present */}
        {imageUrl && (
          <div className="relative h-full w-full rounded-b-md">
          <Image
            src={imageUrl}
            alt="Task image"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
          />
        </div>
        )}

    </div>
  );
}

export default TodoCard;
