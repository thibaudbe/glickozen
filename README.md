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

Server side

```
  cd server/
  activator run
```

Mongo

```
  cd server/db/
  mongod
  mongo glickozen createIndexes.js
```

# Test

Api example

```
  curl "http://localhost:9000/api/ratings?sports=pingpong"
```
