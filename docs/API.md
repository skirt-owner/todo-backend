## API Documentation

### Status Endpoint

#### Get API Status

```http
GET /status
```

This endpoint returns the status of the API.

**Response:**

```javascript
{
  "status": "API is up and running"
}
```

**Response Codes:**

| Status Code | Description                      |
| ----------- | -------------------------------- |
| 200         | `OK` - API is up and running       |

### Server Endpoint

#### Get Server Info

```http
GET /server
```

This endpoint returns the information about the server.

**Response:**

```javascript
{
  "os": "server operating system",
  "version": "server version"
}
```

**Response Codes:**

| Status Code | Description                           |
| ----------- | ------------------------------------- |
| 200         | `OK` - Returns the OS and version of the server |

### Todos Endpoint

#### Create a Todo

```http
POST /todos
```

Creates a new todo with the provided data.

**Request Body:**

```javascript
{
  "title": string,
  "description": string,
  "tags": string
}
```

| Field        | Type   | Description                             |
| ------------ | ------ | --------------------------------------- |
| `title`      | `string` | **Required**. The title of the todo        |
| `description`| `string` | The description of the todo             |
| `tags`       | `string` | Comma-separated list of tags for the todo|

**Response:**

```javascript
{
  "id": number,
  "title": string,
  "description": string,
  "completed": boolean,
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

**Response Codes:**

| Status Code | Description                      |
| ----------- | -------------------------------- |
| 201         | `CREATED` - Returns the created todo |
| 500         | `INTERNAL SERVER ERROR` - Failed to create a new todo |

#### Delete all Todos

```http
DELETE /todos
```

Deletes all todos.

**Response Codes:**

| Status Code | Description                      |
| ----------- | -------------------------------- |
| 204         | `NO CONTENT` - All todos deleted    |
| 500         | `INTERNAL SERVER ERROR` - Failed to delete all todos |

#### Delete a Todo

```http
DELETE /todos/:id
```

Deletes a todo with the specified ID.

**Response Codes:**

| Status Code | Description                           |
| ----------- | ------------------------------------- |
| 204         | `NO CONTENT` - Todo deleted             |
| 404         | `NOT FOUND` - Todo not found            |
| 500         | `INTERNAL SERVER ERROR` - Failed to delete todo |

#### Edit a Todo

```http
PUT /todos/:id
```

Edits a todo with the specified ID.

**Request Body:**

```javascript
{
  "title": string,
  "description": string,
  "tags": string
}
```

| Field        | Type   | Description                             |
| ------------ | ------ | --------------------------------------- |
| `title`      | `string` | The new title of the todo               |
| `description`| `string` | The new description of the todo         |
| `tags`       | `string` | Comma-separated list of tags for the todo|

**Response:**

```javascript
{
  "id": number,
  "title": string,
  "description": string,
  "completed": boolean,
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

**Response Codes:**

| Status Code | Description                                    |
| ----------- | ---------------------------------------------- |
| 200         | `OK` - Returns the updated todo                  |
| 404         | `NOT FOUND` - Todo not found or the same          |
| 500         | `INTERNAL SERVER ERROR` - Failed to update todo   |

#### Get Todos

```http
GET /todos
```

Gets all the todos.

**Response:**

```javascript
[
  {
    "id": number,
    "title": string,
    "description": string,
    "completed": boolean,
    "createdAt": timestamp,
    "updatedAt": timestamp
  },
  ...
]
```

**Response Codes:**

| Status Code | Description                           |
| ----------- | ------------------------------------- |
| 200         | `OK` - Returns the list of todos        |
| 500         | `INTERNAL SERVER ERROR` - Failed to get todos |

#### Get a Todo

```http
GET /todos/:id
```

Gets a todo with the specified ID.

**Response:**

```javascript
{
  "id": number,
  "title": string,
  "description": string,
  "completed": boolean,
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

**Response Codes:**

| Status Code | Description                           |
| ----------- | ------------------------------------- |
| 200         | `OK` - Returns the todo                 |
| 404         | `NOT FOUND` - Todo not found            |
| 500         | `INTERNAL SERVER ERROR` - Failed to get todo |

#### Update Completed Field

```http
PATCH /todos/:id/completed
```

Updates the completed field of a todo with the specified ID.

**Request Body:**

```javascript
{
  "completed": boolean
}
```

| Field       | Type    | Description                                  |
| ----------- | ------- | -------------------------------------------- |
| `completed` | `boolean` | **Required**. The new value of the completed field |

**Response:**

```javascript
{
  "id": number,
  "title": string,
  "description": string,
  "completed": boolean,
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

**Response Codes:**

| Status Code | Description                                 |
| ----------- | ------------------------------------------- |
| 200         | `OK` - Returns the updated todo               |
| 404         | `NOT FOUND` - Todo not found                  |
| 500         | `INTERNAL SERVER ERROR` - Failed to update todo |

#### Add Tag to Todo

```http
POST /todos/:id/tags
```

Adds a new tag to a todo with the specified ID.

**Request Body:**

```javascript
{
  "tag": string
}
```

| Field    | Type   | Description                          |
| -------- | ------ | ------------------------------------ |
| `tag`    | `string` | **Required**. The name of the tag       |

**Response Codes:**

| Status Code | Description                          |
| ----------- | ------------------------------------ |
| 204         | `NO CONTENT` - Tag added to the todo   |
| 404         | `NOT FOUND` - Todo not found           |
| 500         | `INTERNAL SERVER ERROR` - Failed to add tag to todo |

#### Remove Tag from Todo

```http
DELETE /todos/:id/tags/:tag
```

Removes a tag from a todo with the specified ID.

**Response Codes:**

| Status Code | Description                                |
| ----------- | ------------------------------------------ |
| 204         | `NO CONTENT` - Tag removed from the todo     |
| 404         | `NOT FOUND` - Todo or tag not found           |
| 500         | `INTERNAL SERVER ERROR` - Failed to remove tag from todo |

### Route Not Found

#### Handle Route Not Found

```
*
```
(Any unknown endpoint)

**Response Codes:**

| Status Code | Description                           |
| ----------- | ------------------------------------- |
| 404         | `NOT FOUND` - Requested resource not found |
