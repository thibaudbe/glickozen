package models

import java.util.UUID

import org.joda.time.DateTime
import play.api.libs.json._


case object Sports {
  val list = Seq("tabletennis", "babyfoot", "chess", "go")
}

case class Game(uuid: UUID, sport: String, player: String, opponent: String, playerScore: Double, date: DateTime, confirmed: Boolean)
object Game {
  implicit val gameFormat: OFormat[Game] = Json.format[Game].asInstanceOf[OFormat[Game]]
}