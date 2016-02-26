package controllers

import java.util.UUID
import javax.inject.Inject

import models.Game
import play.api.libs.json.{JsObject, Json}
import play.api.mvc._
import play.modules.reactivemongo._
import play.modules.reactivemongo.json._
import reactivemongo.api.commands.WriteResult
import reactivemongo.core.errors.DatabaseException
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class Games @Inject() (val reactiveMongoApi: ReactiveMongoApi)
  extends Controller with MongoController with ReactiveMongoComponents {

  val logger = play.api.Logger("controllers.games")

  val gamesCollection: JSONCollection = db.collection[JSONCollection]("games")

  def addGame = Action.async(parse.json) { request =>

    def insert(game: Game, retry: Int): Future[WriteResult] = {
      gamesCollection.insert(game).recoverWith {
        case e: DatabaseException if e.code == Some(11000) & retry > 0 => insert(game.copy(uuid = UUID.randomUUID()), retry - 1)
        case e =>
          logger.error(s"Failed to insert game into mongo, game: ${game.toString}", e)
          Future.failed(e)
      }
    }

    val jsonWithUUID = request.body.as[JsObject] + ("uuid" -> Json.toJson(UUID.randomUUID()))

    Json.fromJson[Game](jsonWithUUID).fold(
      invalid = { errs => Future.successful(BadRequest(Json.obj("errors" -> errs.toString())))},
      valid = { newGame =>
        insert(newGame, 5).map(_ => Ok(Json.obj{"result" -> "Game added to mongo"}))
      }
    )
  }

  def getGames(player: String) = Action.async {
    val games = gamesCollection.find(
      Json.obj(
        "$or" -> Json.arr(
          Json.obj("player" -> player),
          Json.obj("opponent" -> player)
        )
      )
    ).cursor[Game]().collect[Seq]()

    games.map { games =>
      Ok(Json.toJson(games))
    }
  }

  def getPendingGames(player: String) = Action.async {
    val games = gamesCollection.find(
      Json.obj(
        "opponent" -> player,
        "confirmed" -> false
      )
    ).cursor[Game]().collect[Seq]()

    games.map { games =>
      Ok(Json.toJson(games))
    }
  }

  def confirmGame(uuid:String, confirmed: Boolean) = Action.async {
    if (confirmed) {
      gamesCollection.update(
        Json.obj("uuid" -> uuid),
        Json.obj(
          "$set" -> Json.obj(
            "confirmed" -> true
          )
        )
      ).map(_ => Ok(Json.obj("result" -> "Game confimed")))
    } else {
      gamesCollection.remove(
        Json.obj("uuid" -> uuid)
      ).map(_ => Ok(Json.obj("result" -> "Gamed removed")))
    }
  }
}
