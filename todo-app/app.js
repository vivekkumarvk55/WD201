const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const { Todo } = require("./models");

// eslint-disable-next-line no-unused-vars
app.get("/todos", async (request, response) => {
  console.log("Processing list of all Todos ...");
  try {
    const todo = await Todo.findAll();
    return response.send(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async (request, response) => {
  console.log("Creating a todo", request.body);
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: false,
    });
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
  console.log("We have to update a todo with ID:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  // FILL IN YOUR CODE HERE
  try {
    // Assuming 'id' is the primary key field in your Todo model
    const todo = await Todo.destroy({
      where: {
        id: request.params.id,
      },
    });

    // 'todo' will contain the number of deleted rows (0 or 1 in this case)
    if (todo > 0) {
      response.send(true); // Todo was deleted
    } else {
      response.send(false); // Todo with the specified ID was not found
    }
  } catch (error) {
    console.error("Error deleting Todo: ", error);
    response.status(500).send("Internal Server Error");
  }
  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // response.send(true)
});

module.exports = app;
