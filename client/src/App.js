import React from "react";
import "./App.css";

import { gql } from "apollo-boost";

import { useQuery, useMutation } from "@apollo/react-hooks";

import Paper from "@material-ui/core/Paper";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";

import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const LIST_TODO_ITEMS = gql`
  {
    list {
      id
      text
      isComplete
    }
  }
`;

const UPDATE_TODO_ITEM = gql`
  mutation($id: ID!, $isComplete: Boolean!) {
    update(id: $id, isComplete: $isComplete)
  }
`;

const REMOVE_TODO_ITEM = gql`
  mutation($id: ID!) {
    remove(id: $id)
  }
`;

function App() {
  const { loading, error, data } = useQuery(LIST_TODO_ITEMS);
  const [update] = useMutation(UPDATE_TODO_ITEM);
  const [remove] = useMutation(REMOVE_TODO_ITEM);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div style={{ display: "flex" }}>
      <div style={{ margin: "auto", width: 400 }}>
        <Paper elevation={1}>
          <List>
            {data.list.map(todoItem => {
              let { id, text, isComplete } = todoItem;
              const labelId = `checkbox-list-label-${id}`;
              return (
                <ListItem
                  key={id}
                  role={undefined}
                  dense
                  button
                  onClick={() => {
                    update({
                      variables: { id, isComplete: !isComplete },
                      update: store => {
                        // Read the data from our cache for this query.
                        const data = store.readQuery({
                          query: LIST_TODO_ITEMS
                        });
                        // Add our comment from the mutation to the end.
                        data.list = data.list.map(e =>
                          e.id === id
                            ? {
                                ...todoItem,
                                isComplete: !isComplete
                              }
                            : e
                        );

                        console.log(data);
                        // Write our data back to the cache.
                        store.writeQuery({ query: LIST_TODO_ITEMS, data });
                      }
                    });
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={isComplete}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={text} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        remove({ variables: { id } });
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </div>
    </div>
  );
}

export default App;
