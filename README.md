# TODO (Backend)

TODO is a backend application that provides APIs for managing todos.

## Installation

To get started with TODO, follow these steps:

1. Clone the repository: 
```console
git clone [repository URL]
```
2. Install the dependencies:
```console
npm install
```

## Getting Started

Before running the application, make sure you have set up the following:

1. Configure the database connection in the .env file.
2. Run the database migrations:
```console
npx sequelize-cli db:migrate 
```

To start the application, use the following command:

```console
npm start
```

## API Documentation

The API documentation can be found in the [API Documentation](/docs/API.md) file. It contains detailed information about each API endpoint, request formats, and response formats.

## Technologies Used

[![Node.js](https://img.shields.io/badge/Node.js-14.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)\
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)\
[![Sequelize](https://img.shields.io/badge/Sequelize-6.x-52B0E7?style=for-the-badge)](https://sequelize.org/)\
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-11+-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)


## Project Structure

The project follows a standard structure:

```bash
src
├── controllers
|   └── todoControllers.js
├── middlewares
|   ├── morgan.middleware.js
|   ├── requestId.middleware.js
|   └── responseTime.middleware.js
├── models
|   ├── Todo.js
|   └── Tag.js
├── routes
|   └── todoRoutes.js
├── utils
|   ├── database.js
|   ├── dotenv.js
|   └── logger.js
└── app.js
```

- controllers: Contains the controllers for each route.
- models: Contains the database models.
- routes: Contains the route definitions.
- utils: Contains the utility files such as database connection and logger.
- app.js: Entry point of the application.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any inquiries or questions, feel free to [contact me](mailto:skirtsfield@gmail.com) or reach out on [Telegram](https://t.me/skirtsfield).
