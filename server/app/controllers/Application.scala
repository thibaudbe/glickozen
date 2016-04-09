package controllers

import javax.inject.Inject

import models.{Sport, User}
import play.api.Configuration
import play.api.libs.json._
import play.api.libs.ws.WSClient
import play.api.mvc._
import play.modules.reactivemongo.ReactiveMongoApi

import scala.concurrent.ExecutionContext.Implicits.global

class Application @Inject()(
  val wsClient: WSClient,
  config: Configuration
)(implicit reactiveMongoApi: ReactiveMongoApi) extends Controller {

  def main(path: String) = Action {
    val initData = Json.obj(
      "sports" -> Sport.list
    )

    Ok(views.html.main(initData))
  }

  def getContacts = Action.async { implicit request =>
    User.list().map { users =>
      println(users)
      Ok(Json.obj("data" -> users))
    }
  }

}

