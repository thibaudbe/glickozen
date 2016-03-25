/*

Creates MongoDB indexes

This script only creates an index if the index does not exist.

How to run:

$ mongo host:port/dbname createIndexes.js

*/
var indexUserEmail = db.users.createIndex({email: 1}, {unique: true})

if (indexUserEmail.ok === 1) {
  print("[+] Users: Successfully created Index for (email)")
  print("=> Index count: " + indexUserEmail.numIndexesAfter + ", was: " + indexUserEmail.numIndexesBefore)
} else {
  print("[-] Users: Failed creating Index for (email)")
}

var indexSportCode = db.sports.createIndex({code: 1}, {unique: true})

if (indexSportCode.ok === 1) {
  print("[+] Sports: Successfully created Index for (code)")
  print("=> Index count: " + indexSportCode.numIndexesAfter + ", was: " + indexSportCode.numIndexesBefore)
} else {
  print("[-] Sports: Failed creating Index for (code)")
}

var indexGamesUuid = db.games.createIndex({uuid: 1}, {unique: true})

if (indexGamesUuid.ok === 1) {
  print("[+] Games: Successfully created Index for (uuid)")
  print("=> Index count: " + indexGamesUuid.numIndexesAfter + ", was: " + indexGamesUuid.numIndexesBefore)
} else {
  print("[-] Games: Failed creating Index for (uuid)")
}
