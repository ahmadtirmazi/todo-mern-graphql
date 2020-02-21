import React from "react";
import "./App.css";

import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import Paper from "@material-ui/core/Paper";

const LIST_TODO_ITEMS = gql`
  {
    list {
      id
      text
      isComplete
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(LIST_TODO_ITEMS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div style={{ display: "flex" }}>
      <div style={{ margin: "auto", width: 400 }}>
        <Paper elevation={1}>
          {data.list.map(({ id, text, isComplete }) => (
            <div key={`${id}-todo-item`}>
              {text} ({isComplete ? "Done" : "Pending"})
            </div>
          ))}
        </Paper>
      </div>
    </div>
  );
}

export default App;
