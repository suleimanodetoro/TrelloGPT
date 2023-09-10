const formatTodosForAI = (board: Board) => {
    // copy the column in map as array
    const todos = Array.from(board.columns.entries());

    const flatArray = todos.reduce((map, [key,value]) => {
        map[key] = value.todos;
        return map;

    }, {} as {[key in TypedColumn]: Todo[]})
    console.log('Flat array', flatArray);

    // reduce to key:value(length)
    const flatArrayCounted = Object.entries(flatArray).reduce((map, [key,value]) => {
        map[key as TypedColumn] = value.length;
        return map;

    }, {} as {[key in TypedColumn]: number})
    console.log('Flat Counted Array to give AI', flatArrayCounted);

    return flatArrayCounted;
};

export default formatTodosForAI;