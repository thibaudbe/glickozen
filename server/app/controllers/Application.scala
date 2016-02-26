package controllers

import models.Sports
import play.api._
import play.api.mvc._
import play.api.libs.json._


class Application extends Controller {

  def main = Action {
    val initData = Json.obj(
      "sports" -> Sports.list
    )

    Ok(views.html.main(initData))
  }

}
