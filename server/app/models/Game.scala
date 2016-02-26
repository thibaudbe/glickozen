package models

import java.util.UUID

import org.joda.time.DateTime
import play.api.libs.json._
import play.modules.reactivemongo.json._
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.ExecutionContext.Implicits.global

import scala.concurrent.Future


case class Game(uuid: UUID, player: String, opponent: String, playerScore: Double, date: DateTime, confirmed: Boolean)
object Game {
  implicit val gameFormat: OFormat[Game] = Json.format[Game].asInstanceOf[OFormat[Game]]

  def getPendingGames(player: String, collection: JSONCollection): Future[Seq[Game]] = {
    collection.find(
      Json.obj(
        "opponent" -> player,
        "confirmed" -> false
      )
    ).cursor[Game]().collect[Seq]()
  }
}