# Backend

## TODO API Documentation

### Status Endpoint

#### Get API Status

Endpoint: GET /status

This endpoint returns the status of the API.

Responses:
- 200 OK - The API is up and running.

### Server Endpoint

#### Get Server Info

Endpoint: GET /server

This endpoint returns the information about the server.

Responses:
- 200 OK - Returns the OS and version of the server.

### Todos Endpoint

#### Create a Todo

Endpoint: POST /todos

Creates a new todo with the provided data.

Request Body:
- title (required): The title of the todo.
- description: The description of the todo.
- tags: Comma-separated list of tags for the todo.

Responses:
- 201 Created - Returns the created todo.
- 500 Internal Server Error - Failed to create a new note.

#### Delete all Todos

Endpoint: DELETE /todos

Deletes all todos.

Responses:
- 204 No Content - All todos deleted.
- 500 Internal Server Error - Failed to delete all todos.

#### Delete a Todo

Endpoint: DELETE /todos/:id

Deletes a todo with the specified ID.

Path Parameters:
- id (required): The ID of the todo to delete.

Responses:
- 204 No Content - Todo deleted.
- 404 Not Found - Todo not found.
- 500 Internal Server Error - Failed to delete todo.

#### Edit a Todo

Endpoint: PUT /todos/:id

Edits a todo with the specified ID.

Path Parameters:
- id (required): The ID of the todo to edit.

Request Body:
- title: The new title of the todo.
- description: The new description of the todo.
- tags: Comma-separated list of tags for the todo.

Responses:
- 200 OK - Returns the updated todo.
- 404 Not Found - Todo not found or the same.
- 500 Internal Server Error - Failed to update todo.

#### Get Todos

Endpoint: GET /todos

Gets all the todos.

Query Parameters:
- sortBy: Sort the todos by createdAt field (ASC or DESC).
- filterByTitle: Filter todos by title.
- filterByTags: Filter todos by tags. Only return todos that have the specified tags.

Responses:
- 200 OK - Returns the list of todos.
- 500 Internal Server Error - Failed to get todos.

#### Get a Todo

Endpoint: GET /todos/:id

Gets a todo with the specified ID.

Path Parameters:
- id (required): The ID of the todo to get.

Responses:
- 200 OK - Returns the todo.
- 404 Not Found - Todo not found.
- 500 Internal Server Error - Failed to get todo.

#### Update Completed Field

Endpoint: PATCH /todos/:id/completed

Updates the completed field of a todo with the specified ID.

Path Parameters:
- id (required): The ID of the todo to update.

Request Body:
- completed: The new value of the completed field.

Responses:
- 200 OK - Returns the updated todo.
- 404 Not Found - Todo not found.
- 500 Internal Server Error - Failed to update completed field of todo.

#### Add Tag to Todo

Endpoint: POST /todos/:id/tags

Adds a new tag to a todo with the specified ID.

Path Parameters:
- id (required): The ID of the todo to add the tag to.

Request Body:
- tag: The name of the tag to add.

Responses:
- 204 No Content - Tag added to the todo.
- 404 Not Found - Todo not found.
- 500 Internal Server Error - Failed to add tag to todo.

#### Remove Tag from Todo

Endpoint: DELETE /todos/:id/tags/:tag

Removes a tag from a todo with the specified ID.

Path Parameters:
- id (required): The ID of the todo to remove the tag from.
- tag (required): The name of the tag to remove.

Responses:
- 204 No Content - Tag removed from the todo.
- 404 Not Found - Todo or tag not found.
- 500 Internal Server Error - Failed to remove tag from todo.

### Route Not Found

#### Handle Route Not Found

Endpoint: (Any unknown endpoint)

Handles the case when a requested resource is not found.

Responses:
- 404 Not Found - Requested resource not found.
