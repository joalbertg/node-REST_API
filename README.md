# REST API

[JSON Web Token][jwt]

[jwt]: https://jwt.io/

### installs

With `package.json` and dependencies
```shell
docker-compose run app yarn
```

Without dependecies
```shell
docker-compose run app yarn express body-parser mongoose mongoose-unique-validator bcrypt underscore
docker-compose run app yarn --dev nodemon dotenv
```

### Start project

> run `docker-compose up`

### app service

> `localhost:8080`, you can change the port in `docker-compose.yml` file `<host-port>:8081`

#### mongo-express service

> `localhost:8081`, you can change the port in `docker-compose.yml` file `<host-port>:8080`

#### mongo service

Data persists in `/data/db` file.

### Structure

> run `tree -I "node_modules|data"`
```shell
.
├── Dockerfile
├── README.md
├── docker-compose.yml
├── package.json
├── src
│   ├── config
│   │   └── index.js
│   └── server
│       └── app.js
└── yarn.lock

3 directories, 7 files
```

### Heroku

To deploy to the Heroku service

> run `docker-compose run app node --version`, get the node version

Add the **engines** key to `package.json`
```json
...
"engines": {
    "node": "14.0.0"
  }
...
```

> run `heroku login`

- Create add
> run `heroku apps:create <app-name>`

- View git remotes
> run `git remote -v`

- Push heroku
> run `git push heroku master`

- View logs
> run `heroku logs --tail`

- Open app
> run `heroku open`

- View vars
> run `heroku config`

- Create var
> run `heroku config:set <var-name>="<value>"`

- Delete var
> run `heroku config:unset <var-name>`

### Decode tocken

```javascript
function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};
```

