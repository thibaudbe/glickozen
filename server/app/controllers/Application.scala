package controllers

import javax.inject.Inject

import models.{Sports, User}
import play.api._
import play.api.mvc._
import play.api.libs.json._
import play.api.libs.functional.syntax._
import play.modules.reactivemongo.ReactiveMongoApi

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future


class Application @Inject() (implicit reactiveMongoApi: ReactiveMongoApi) extends Controller {

  def main = Action {
    val initData = Json.obj(
      "sports" -> Sports.list
    )

    Ok(views.html.main(initData))
  }

  case class Auth(
    mail: String,
    name: String,
    token: String
  )

  val authReads = (
    (__ \ "mail").read[String] and
      (__ \ "name").read[String] and
      (__ \ "token").read[String]
    ) (Auth.apply _)

  def login = Action.async(parse.json) { implicit request =>
    request.body.validate(authReads).fold(
      { errors => Future.successful(BadRequest(Json.obj("error" -> "Bad Request"))) }, { auth =>
        val user = User(email = auth.mail, name = auth.name, google_token = auth.token)
        User.upsertByEmail(user).map(_ => Ok(Json.obj()).withSession(
          "email" -> user.email
        ))
      }
    )
  }
}

