package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json._


class Application extends Controller {

  def main = Action {
    val initData = Json.obj(
      "pendings" -> Json.parse(""" 
        [{
          "uuid": "12345665432123456",
          "date" : 1456487141420,
          "player" : "tbo",
          "opponent" : "sro",
          "confirmed" : false,
          "playerScore" : 1,
          "sport": "pingpong"
        },{
          "uuid": "12385665432123456",
          "date" : 1456487141420,
          "player" : "tbo",
          "opponent" : "sro",
          "confirmed" : false,
          "playerScore" : 0.5,
          "sport": "pingpong"
        },{
          "uuid": "12345665432123456",
          "date" : 1456487141420,
          "player" : "tbo",
          "opponent" : "sro",
          "confirmed" : false,
          "playerScore" : 0,
          "sport": "pingpong"
        }]
      """)
    )

    Ok(views.html.main(initData))
  }

}
