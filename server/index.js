const { GraphQLServer } = require("graphql-yoga");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/todo", { useNewUrlParser: true });

const typeDefs = `
  type Query {
    hello(name: String): String!
  }
  type Todo {
    id: ID!
    text: String!
    isComplete: Boolean!
  }
  type Mutation {
    createTodo(text: String!): Todo
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`
  },
  Mutation: {
    createTodo: (_, { text }) => {
      const todo = new Todo({ text, isComplete: false });
      todo.save();
      return todo;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  // we're connected!
  server.start(() => console.log("Server is running on localhost:4000"));
});

var Todo = mongoose.model("Todo", {
  text: String,
  isComplete: Boolean
});
