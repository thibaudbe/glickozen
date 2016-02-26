package models

import play.api.libs.json.{OFormat, Json}
import sglicko2.EitherOnePlayerWinsOrItsADraw.{Player2Wins, Draw, Player1Wins}
import sglicko2.{Player, Leaderboard, EitherOnePlayerWinsOrItsADraw, Glicko2}

case class Ratings(player: String, rating: Double, rd: Double, volatility: Double)
object Ratings {
  implicit val ratingsFormat: OFormat[Ratings] = Json.format[Ratings].asInstanceOf[OFormat[Ratings]]

  val glicko2 = new Glicko2[String, EitherOnePlayerWinsOrItsADraw]()

  def updateRatings(game: Game, allRatings: Seq[Ratings]): Seq[Ratings] = {
    val players: Seq[Player[String]] = buildGlickoPlayersFromRatings(allRatings)

    val currentLeaderboard = Leaderboard.fromPlayers(players)


    val outcome = game.playerScore match {
      case 1 => Player1Wins
      case 0.5 => Draw
      case 0 => Player2Wins
    }

    val ratingPeriod = glicko2.newRatingPeriod.withGame(game.player, game.opponent, outcome)

    val newLeaderboard = glicko2.updatedLeaderboard(currentLeaderboard, ratingPeriod)

    val newRatings = newLeaderboard.playersInRankOrder.map { player =>
      Ratings(player.id, player.rating, player.deviation, player.volatility)
    }

    newRatings
  }

  def buildGlickoPlayersFromRatings(allRatings: Seq[Ratings]): Seq[Player[String]] = {
    allRatings.map(ratings => Player(ratings.player, ratings.rating, ratings.rd, ratings.volatility))
  }
}