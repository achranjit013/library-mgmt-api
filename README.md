# Library Management

The Library Management System is a project aimed at efficiently managing the borrowing and returning of books for users. This system provides a user-friendly interface for both librarians and library users to interact with the library's book inventory.

This is the api server of

You can visit [Here]()

## How to use

1. Clone the project by running `git clone https://github.com/achranjit013/library-mgmt-api.git` in your terminal.
2. Run `cd <foldername>` to go inside the project folder or open the project in your fab code editor.
3. Install dependencies `npm i` from the terminal with in the root directory of the project.
4. Rename `.env.sample` to `.env` and pass the value accordingly
5. Run the project `npm run dev` for the dev environment and `npm start` in the production. Please note that `npm run dev` will use `nodemon` behind. So, run `npm i nodemon -g` to install nodemon package in your system level.
6. The server should be running at [`http://localhost:8000`](http://localhost:8000)

## Available apis

All the apis segmentation path are followed by `http://localhost:8000/api/v1`

### Users API

Users api will follow the following pattern `http://localhost:8000/api/v1/users`

| #   | PATH          | METHOD | PRIVATE | DESCRIPTION                                                                                                              |
| --- | ------------- | ------ | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| 1.  | `/`           | `GET`  | TRUE    | It returns the user object                                                                                               |
| 2.  | `/`           | `POST` | FALSE   | Server expects the user object and creates a new user in the databse                                                     |
| 3.  | `/admin-user` | `POST` | TRUE    | Server expects the user object and creates a new admin in the databse. Only authenticated admin can create another admin |

### Books API

Books api will follow the following pattern `http://localhost:8000/api/v1/books`

| #   | PATH | METHOD | PRIVATE | DESCRIPTION |
| --- | ---- | ------ | ------- | ----------- |
| 1.  |      |        |         |             |
