import formatTodosForAI from "./formatTodosForAI";
const fetchSuggestion = async (board: Board) => {
  // format todo data for use in api call
  const todos = formatTodosForAI(board);
  
  // make call to our endpoint created /app/api/
  const res = await fetch("/api/generateSummary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todos }),
  });

  const GPTdata = await res.json();  
  const {content} = GPTdata;
  return content;
};
export default fetchSuggestion;
