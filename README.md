# cheriya.link

**Cheriya** is an URL shortener with basic user registration and authentication that allows for shortening of any given URL. Cheriya is powered by Node.js (w/ Express) at the backend and MongoDB for the database using Mongoose.

## Features

- User registration and login.
- User dashboard to create, view, and share tiny URLs.
- Admin dashboard to manage users and associated URLs.

## Dependencies

- [Express](https://expressjs.com/): Fast and minimalist web application framework for Node.js.
- [Mongoose](https://mongoosejs.com/): Object Data Modeling MongoDB and Node.js.
- [EJS](https://ejs.co/): Templating language.
- [nanoid](https://www.npmjs.com/package/nanoid): Small, secure, and URL-friendly unique ID generator.
- [passport](http://www.passportjs.org/): Simple and modular authentication middlware.
- [passport-local](http://www.passportjs.org/packages/passport-local/): Passport strategy for authenticating with a username and password.
- [bcrypt](https://www.npmjs.com/package/bcrypt): A library for hashing and comparing passwords.

## 🚀 Getting Started

### Installation

1. Clone the repository.

```sh
git clone https://github.com/waterrmalann/cheriya.git
```

2. Install the dependencies.

```sh
npm install
```

3. Run the project.

```sh
npm start
```

4. Access the application.

```
Open your browser and visit http://localhost:3000
```

### Folder Structure

The project follows a Model-View-Controller (MVC) architecture, the folder structure is as follows:

```
.
├── .env
├── server.mjs
├── models
│   ├── Token.mjs
│   ├── Url.mjs
│   └── User.mjs
├── views
│   ├── user
│   │   └── dashboard.ejs
│   ├── admin
│   │   ├── dashboard.ejs
│   │   └── user.ejs
│   ├── _header.ejs
│   ├── register.ejs
│   ├── login.ejs
│   ├── preview.ejs
│   └── index.ejs
├── controllers
│   ├── rootController.mjs
│   ├── userController.mjs
│   ├── adminController.mjs
│   ├── authController.mjs
│   └── urlController.mjs
├── routes
│   ├── root.mjs
│   ├── user.mjs
│   ├── admin.mjs
│   ├── auth.mjs
│   └── url.mjs
├── utils
│   ├── authenticate.mjs
│   ├── password.mjs
│   ├── token.mjs
│   └── validate.mjs
├── public
│   ├── css
│   │   └── style.css
│   └── js
│       ├── dashboard.js
│       └── form.js
├── package.json
├── package-lock.json
├── README.md
└── LICENSE
```

### Document Schema

`models/Url.mjs`
```js
{
    url: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        required: true
    },
    clicks: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}
```

`models/User.mjs`
```js
{
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    urls: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}
```

`models/Token.mjs`
```js
{
    token: {
         type: String,
         required: true
     },
     createdFor: {
         type: Schema.Types.ObjectId,
         ref: "User"
     },
     createdAt: {
         type: Date,
         default: Date.now
     }
}
```

## 🤝 Contribution

Contributions are always accepted. Feel free to open a pull request to fix any issues or to make improvements you think that should be made. Any contribution will be accepted as long as it doesn't stray too much from the objective of the app. If you're in doubt about whether the PR would be accepted or not, you can always open an issue to get my opinion on it.

## License

This project is licensed under the permissive **MIT License**, see [LICENSE](LICENSE).