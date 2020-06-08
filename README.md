# REST API

### installs

With `package.json` and dependencies
```shell
docker-compose run app yarn
```

Without dependecies
```shell
docker-compose run app yarn express
docker-compose run app yarn --dev nodemon
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
│   └── server
│       └── app.js
└── yarn.lock

2 directories, 6 files
```

