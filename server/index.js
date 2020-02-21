const { GraphQLServer } = require("graphql-yoga");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/todo", { useNewUrlParser: true });

const typeDefs = `
  type Query {
    list: [Todo]
  }
  type Todo {
    id: ID!
    text: String!
    isComplete: Boolean!
  }
  type Mutation {
    createTodo(text: String!): Todo
    update(id: ID!, isComplete: Boolean!): Boolean
    remove(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    list: () => Todo.find()
  },
  Mutation: {
    createTodo: async (_, { text }) => {
      const todo = new Todo({ text, isComplete: false });
      await todo.save();
      return todo;
    },
    update: async (_, { id, isComplete }) => {
      await Todo.findByIdAndUpdate(id, { isComplete });
      return true;
    },
    remove: async (_, { id }) => {
      await Todo.findByIdAndRemove(id);
      return true;
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
