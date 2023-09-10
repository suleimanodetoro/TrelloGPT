"use client";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from "react";
import Column from "./Column";

function Board() {
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore((state) => [
    state.board,
    state.getBoard,
    state.setBoardState,
    state.updateTodoInDB
  ]);

  useEffect(() => {
    getBoard();
    // call getBoard and give access to this data all around the application. We will use zustand instead of redux for this...
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    // Result should contain type of drop, source, and destination
    const { destination, source, type } = result;

    // If the user drags but does not take to any column(destination), return
    if (!destination) return;

    // Handle dragging an entire column --- different from task drag
    if (type === "column") {
      // First step is to get the board column entries, and convert to array (currently a map)
      const entries = Array.from(board.columns.entries());

      // splice the array, take from the source index -- basically store the element we are moving about
      const [removed] = entries.splice(source.index, 1);

      // splice the array, push the removed column into an array of entries- most importantly in the correct position I dropped it in
      entries.splice(destination.index, 0, removed);

      //   create a new map of the rearranged columns and store that in the board state
      const rearrangedColumns = new Map(entries);
      //set board state to new value -- setBoardState in store
      // keep everything in already on the board, change the column (To Do, In Progress, or Done Column)
      setBoardState({ ...board, columns: rearrangedColumns });
      return;
    }
    // The following are to handle cards in columns moving around, and also to other columns

    // Columns, Start & Finish Indexs are necessary to
    const columns = Array.from(board.columns); // create a copy of the columns
    //Since the index are stored as numbers 1,2,3, if we get the number, we know which column we are taking from, or taking to
    // Debugging statements before the problematic code
    const startColIndex = columns[Number(source.droppableId)]; // T
    const finishColIndex = columns[Number(destination.droppableId)];

    // Rebuild the start and finish column
    const startColumn: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };

    const finishColumn: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    // Now that we have columns, time for conditional logic

    // If we did not get the start or finish column for any reason, return
    if (!startColumn || !finishColumn) return;

    // If we get the columns, but after moving, items are still in previous positions, do nothing
    if (source.index === destination.index && startColumn === finishColumn)
      return;

    // If we do have a change, store the todos in the starting column
    const newTodos = startColumn.todos;
    // splice the todo to be moved

    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startColumn.id === finishColumn.id) {
      // Meaning user is doing a same-column todo/task drag
      newTodos.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startColumn.id,
        todos: newTodos,
      };
      const newColumns = new Map(board.columns);
      newColumns.set(startColumn.id, newCol);

      setBoardState({ ...board, columns: newColumns });
    } else {
      // meaning user is dragging task from one column to another
      const finishTodos = Array.from(finishColumn.todos);
      finishTodos.splice(destination.index, 0, todoMoved);
      // create a copy
      const newColumns = new Map(board.columns);
      const newCol = {
        id: startColumn.id,
        todos: newTodos,
      };

      // New column
      newColumns.set(startColumn.id, newCol);
      // Add to destination column
      newColumns.set(finishColumn.id, {
        id: finishColumn.id,
        todos: finishTodos,
      });
    //   update AppWrite database with new todo details
    // Contains the todo/task, and the the columnID: TODO, INPROGRESS, OR DONE
    updateTodoInDB(todoMoved, finishColumn.id);

// save details to board store 
      setBoardState({ ...board, columns: newColumns });
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      {/* You have to give the droppable an ID and then a direction */}
      <Droppable droppableId="board" direction="horizontal" type="column">
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
                {provided.placeholder}

          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
