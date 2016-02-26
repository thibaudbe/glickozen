package models

import play.api.libs.json.{Reads, Writes, Json}

case class Ratings(player: String, rating: Double, rd: Double, volatility: Double)
object Ratings {
  implicit val ratingsReads: Reads[Ratings] = Json.reads[Ratings]
  implicit val ratingsWrites: Writes[Ratings] = Json.writes[Ratings]
}