package controllers

import java.util.UUID
import javax.inject.Inject

import models.{Ratings, Game}
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
  val ratingsCollection: JSONCollection = db.collection[JSONCollection]("ratings")

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

  def confirmGame = Action.async(parse.json) { request =>
    val uuid = (request.body \ "uuid").as[String]
    val confirmed = (request.body \ "confirmed").as[Boolean]

    if (confirmed) {
      for {
        _ <- {
          gamesCollection.update(
            Json.obj("uuid" -> uuid),
            Json.obj(
              "$set" -> Json.obj(
                "confirmed" -> true
              )
            )
          )
        }
        gameOpt <- {
          gamesCollection.find(Json.obj("uuid" -> uuid)).one[Game]
        }
        game <- {
          gameOpt.map(Future.successful(_)).getOrElse(Future.failed(new Exception(s"Game ${uuid} not found")))
        }
        allSportRatings <- ratingsCollection.find(Json.obj("sport" -> game.sport)).cursor[Ratings]().collect[Seq]()
        newRatings <- Future.successful(Ratings.updateRatings(game, allSportRatings))
        _ <- {
          val updateResultsSeq = newRatings.map { ratings =>
            ratingsCollection.update(
              Json.obj("player" -> ratings.player),
              ratings,
              upsert = true
            )
          }

          Future.sequence(updateResultsSeq)
        }
      } yield {
        Ok(Json.obj("result" -> "Game confimed", "newRatings" -> newRatings))
      }
    } else {
      gamesCollection.remove(
        Json.obj("uuid" -> uuid)
      ).map(_ => Ok(Json.obj("result" -> "Gamed removed")))
    }
  }

  def getRankedPlayers(sport: String) = Action.async {
    val rankedRatings = ratingsCollection.find(Json.obj("sport" -> sport))
      .sort(Json.obj("rating" -> -1))
      .cursor[Ratings]()
      .collect[Seq]()

    rankedRatings.map { rankedRatings =>
      Ok(Json.obj("rankedPlayers" -> rankedRatings))
    }
  }
}
