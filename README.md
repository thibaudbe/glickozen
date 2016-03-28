Glicko Zen
===

A Zengularity hackday project.


# Dev

Client side

```
  cd client/
  npm install
  npm start
```

Enable logs

```
  http://localhost:3000/?log=all#/
  http://localhost:3000/?log=fluxx#/ // or store
  http://localhost:3000/?log=abyssa#/ // or router
```

Server side

```
  cd server/
  activator run
```

Mongo

```
  cd server/db
  sudo mongod
  mongo glickozen createIndexes.js
```


# Test

Api example

```
  curl "http://localhost:9000/api/ratings?sports=pingpong"
```
