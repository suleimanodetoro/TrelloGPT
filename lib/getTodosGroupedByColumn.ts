import { databases } from "@/appwrite";
import React from "react";
export const getTodosGroupedByColumn = async () => {
  // pull information from the database
  // Pass in the database ID and collection ID. You can also pass queries and others
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
  );

  const todos = data?.documents;
  console.log(todos);

  // accumulator function to reduce todos down to a map
  // 'acc' starts off as a new map basically
  const columns = todos.reduce((acc, todo) => {
    // if there is no todo key-value pair in the map, create a key inside that map to store todo values
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [], // this array
      });
    }
    // get a key and push item into todos array. We have created the key above
    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      // get image if it exists on todo
      // if it exists, store the image in the map object
      ...(todo.image &&
        (() => {
          try {
            return { image: JSON.parse(todo.image) };
          } catch (error) {
            console.error(`Error parsing JSON in todo.image: ${error}`);
            return {}; // Return an empty object or handle the error as needed
          }
        })()),
    });

    return acc;
  }, new Map<TypedColumn, Column>());
  // if columns doesn't have in progress, todo, or done, add them with empty todos
  const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];
  for (const columnType of columnTypes) {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  }
  // Create array of key value pairs so we can sort it easily ->
  const sortedColumns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
  );

  const board: Board = { columns: sortedColumns };
  console.log("columns in get func", columns);

  return board;
};
