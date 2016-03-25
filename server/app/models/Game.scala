package models

import java.util.UUID

import scala.concurrent.ExecutionContext.Implicits.global
import org.joda.time.DateTime
import play.api.libs.json._
import play.modules.reactivemongo.ReactiveMongoApi
import reactivemongo.api.commands.WriteResult
import reactivemongo.core.errors.DatabaseException
import utils.Repository

import scala.concurrent.Future

case class Game(
  uuid: UUID,
  sport: String, // the sport code
  team1: Set[String], // team1 emails
  team2: Set[String], // team2 emails
  team1Score: Double,
  date: DateTime,
  confirmed: Boolean
)

object Game extends Repository[Game] {

  val logger = play.api.Logger("models.game")

  override val collectionName: String = "games"
  override implicit val format: OFormat[Game] = Json.format[Game].asInstanceOf[OFormat[Game]]

  def insert(game: Game, retry: Int)(implicit reactiveMongoApi: ReactiveMongoApi): Future[WriteResult] = {
    Game.save(game).recoverWith {
      case e: DatabaseException if e.code.contains(11000) & retry > 0 => insert(game.copy(uuid = UUID.randomUUID()), retry - 1)
      case e =>
        logger.error(s"Failed to insert game into mongo, game: ${game.toString}", e)
        Future.failed(e)
    }
  }
}