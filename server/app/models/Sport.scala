package models

import play.api.libs.json.{Json, OFormat}
import play.modules.reactivemongo.ReactiveMongoApi
import sglicko2.EitherOnePlayerWinsOrItsADraw.{Draw, Player1Wins, Player2Wins}
import sglicko2.{EitherOnePlayerWinsOrItsADraw, Glicko2, Leaderboard, Player}
import utils.Repository
import scala.concurrent.ExecutionContext.Implicits.global

import scala.concurrent.Future

case class Sport(
  code: String,
  label: String,
  leaderBoard: Seq[Ratings]
)

object Sport extends Repository[Sport] {
  override val collectionName: String = "sports"
  override implicit val format: OFormat[Sport] = Json.format[Sport].asInstanceOf[OFormat[Sport]]

  // FIXME
  val list = Seq("tabletennis", "babyfoot", "chess", "go")

  val glicko2 = new Glicko2[Set[String], EitherOnePlayerWinsOrItsADraw]()

  def updateRatings(game: Game)(implicit reactiveMongoApi: ReactiveMongoApi): Future[Seq[Ratings]] = {
    for {
      sportOpt <- findByOpt(Json.obj("code" -> game.sport))
      sport <- sportOpt.map(Future.successful(_)).getOrElse(Future.successful(Sport(game.sport, "", Seq())))
      teams = buildGlickoPlayersFromRatings(sport.leaderBoard)
      currentLeaderboard = Leaderboard.fromPlayers(teams)
      outcome = game.team1Score match {
        case 1 => Player1Wins
        case 0.5 => Draw
        case 0 => Player2Wins
      }
      ratingPeriod = glicko2.newRatingPeriod.withGame(game.team1, game.team2, outcome)
      newLeaderboard = glicko2.updatedLeaderboard(currentLeaderboard, ratingPeriod)
      newRatings = newLeaderboard.playersInRankOrder.map { player =>
        Ratings(player.id, player.rating, player.deviation, player.volatility)
      }
      _ <- Sport.upsert(
        Json.obj("code" -> sport.code),
        sport.copy(leaderBoard = newRatings)
      )
    } yield newRatings
  }

  def buildGlickoPlayersFromRatings(allSportRatings: Seq[Ratings]): Seq[Player[Set[String]]] = {
    allSportRatings.map(ratings => Player(ratings.team, ratings.rating, ratings.rd, ratings.volatility))
  }
}

case class Ratings(team: Set[String],rating: Double, rd: Double, volatility: Double)

object Ratings {
  implicit val ratingsFormat: OFormat[Ratings] = Json.format[Ratings].asInstanceOf[OFormat[Ratings]]
}