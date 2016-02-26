/*

Creates MongoDB indexes

This script only creates an index if the index does not exist.

How to run:

$ mongo host:port/dbname createIndexes.js

*/
var indexGamesUuid = db.games.createIndex({uuid: 1}, {unique: true})

if (indexGamesUuid.ok === 1) {
  print("[+] Games: Successfully created Index for (uuid)")
  print("=> Index count: " + indexGamesUuid.numIndexesAfter + ", was: " + indexGamesUuid.numIndexesBefore)
} else {
  print("[-] Games: Failed creating Index for (uuid)")
}


var indexRatingsPlayer = db.ratings.createIndex({sport: 1, player: 1}, {unique: true})

if (indexRatingsPlayer.ok === 1) {
  print("[+] Ratings: Successfully created Index for (sport, player)")
  print("=> Index count: " + indexRatingsPlayer.numIndexesAfter + ", was: " + indexRatingsPlayer.numIndexesBefore)
} else {
  print("[-] Ratings: Failed creating Index for (sport, player)")
}