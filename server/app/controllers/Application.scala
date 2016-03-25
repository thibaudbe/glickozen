package controllers

import javax.inject.Inject

import play.api.Configuration
import models.{Sport, User}
import play.api.libs.functional.syntax._
import play.api.libs.json._
import play.api.libs.ws.WSClient
import play.api.mvc._
import play.modules.reactivemongo.ReactiveMongoApi

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class Application @Inject()(
  val wsClient: WSClient,
  config: Configuration
)(implicit reactiveMongoApi: ReactiveMongoApi) extends Controller with Security{

  def main = Action {
    val initData = Json.obj(
      "sports" -> Sport.list
    )

    Ok(views.html.main(initData))
  }

  def auth = LoggedUserAction().async {
    Future.successful(Ok(Json.obj()))
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
      errors => Future.successful(BadRequest(Json.obj("error" -> "Bad Request"))),
      auth =>
        wsClient.url(s"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${auth.token}").get().flatMap { response =>
          val jsonResponse: JsValue = Json.parse(response.body)
          val aud = (jsonResponse \ "aud").toOption match {
            case Some(JsString(s)) =>
              config.getString("google.oauth.clientID").contains(s)
            case _ =>
              println("FALSE")
              false
          }
          val sub = (jsonResponse \ "sub").toOption match {
            case Some(JsString(s)) => Some(s)
            case _ => None
          }
          val email = (jsonResponse \ "email").toOption match {
            case Some(JsString(m)) => Some(m)
            case _ => None
          }
          val name = (jsonResponse \ "name").toOption match {
            case Some(JsString(n)) => Some(n)
            case _ => None
          }
          val picture = (jsonResponse \ "picture").toOption match {
            case Some(JsString(p)) => Some(p)
            case _ => None
          }
          if (aud && Seq(sub, email, name, picture).forall(_.isDefined)) {
            val user = User(email = email.get, name = name.get, google_token = sub.get, picture = picture.get)
            User.upsertByEmail(user).map { _ =>
              Ok(Json.obj()).withSession("email" -> user.email)
            }
          } else Future.successful(BadRequest)
        }

    )
  }

  def getContacts = LoggedUserAction().async { implicit request =>
    User.list().map { users =>
      Ok(Json.obj("data" -> users))
    }
  }

  def unauth = Action {
    Unauthorized
  }

}

