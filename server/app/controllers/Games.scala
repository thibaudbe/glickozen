package controllers

import java.util.UUID
import javax.inject.Inject

import models.{Game, Ratings, Sport}
import play.api.libs.json.{JsObject, Json}
import play.api.mvc._
import play.modules.reactivemongo._
import play.modules.reactivemongo.json._
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class Games @Inject() (implicit reactiveMongoApi: ReactiveMongoApi)
  extends Controller with Security {

  val logger = play.api.Logger("controllers.games")

  val gamesCollection: JSONCollection = reactiveMongoApi.db.collection[JSONCollection]("games")
  val ratingsCollection: JSONCollection = reactiveMongoApi.db.collection[JSONCollection]("ratings")

  def addGame = LoggedUserAction().async(parse.json) { request =>

    val jsonWithUUID = request.body.as[JsObject] + ("uuid" -> Json.toJson(UUID.randomUUID()))

    Json.fromJson[Game](jsonWithUUID).fold(
      invalid = { errs => Future.successful(BadRequest(Json.obj("errors" -> errs.toString())))},
      valid = { newGame =>
        for {
          _ <- Game.insert(newGame, 5)
          - <- updateGameCollection(newGame.uuid.toString)
          game <- retrieveGame(newGame.uuid.toString)
          newRatings <- Sport.updateRatings(game)
        } yield {
          Ok(Json.obj("result" -> "Game added to mongo", "newRatings" -> newRatings))
        }
      }
    )
  }

//  def getGames = LoggedUserAction().async {
//    gamesCollection.find(Json.obj(
//        "$or" -> Json.arr(
//          Json.obj("player" -> player),
//          Json.obj("opponent" -> player)
//        )
//      ))
//      .cursor[Game]()
//      .collect[Seq]()
//      .map(games => Ok(Json.toJson(games)))
//  }

  def getPendingGames(player: String) = LoggedUserAction().async {
    gamesCollection.find(
      Json.obj(
        "opponent" -> player,
        "confirmed" -> false
      ))
      .cursor[Game]()
      .collect[Seq]()
      .map { games =>
      Ok(Json.toJson(games))
    }
  }

  private def updateGameCollection(uuid: String) = gamesCollection.update(
    Json.obj("uuid" -> uuid),
    Json.obj(
      "$set" -> Json.obj(
        "confirmed" -> true
      )
    )
  )

  private def retrieveGame(uuid: String) = for {
    gameOpt <- Game.findByOpt(Json.obj("uuid" -> uuid))
    game <- gameOpt.map(Future.successful).getOrElse(Future.failed(new Exception(s"Game $uuid not found")))
  } yield game

  def confirmGame = LoggedUserAction().async(parse.json) { request =>
    val uuid = (request.body \ "uuid").as[String]
    val confirmed = (request.body \ "confirmed").as[Boolean]

    if (confirmed) {
      for {
        _ <- updateGameCollection(uuid)
        game <- retrieveGame(uuid)
        newRatings <- Sport.updateRatings(game)
      } yield {
        Ok(Json.obj("result" -> "Game confimed", "newRatings" -> newRatings))
      }
    } else {
      Game.remove(Json.obj("uuid" -> uuid))
        .map(_ => Ok(Json.obj("result" -> "Gamed removed")))
    }
  }

  def getRankedPlayers(sport: String) = LoggedUserAction().async {
    ratingsCollection.find(Json.obj("sport" -> sport))
      .sort(Json.obj("rating" -> -1))
      .cursor[Ratings]()
      .collect[Seq]()
      .map(rankedRatings => Ok(Json.obj("rankedPlayers" -> rankedRatings)))
  }
}
