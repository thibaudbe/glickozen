package controllers

import models.User
import play.api.libs.json.Json
import play.api.mvc._
import play.modules.reactivemongo.ReactiveMongoApi
import scala.concurrent.ExecutionContext.Implicits.global

import scala.concurrent.Future

case class UserRequest[A](user: User, request: Request[A]) extends WrappedRequest[A](request)

trait Security extends Controller {

  case class LoggedUserAction(implicit reactiveMongoApi: ReactiveMongoApi) extends ActionBuilder[UserRequest] with ActionRefiner[Request, UserRequest] {

    protected def refine[A](request: Request[A]): Future[Either[Result, UserRequest[A]]] = {
      request.session.get("email") match {
        case Some(email) =>
          for {
            userOpt <- User.findByOpt(Json.obj("email" -> email))
            result <- {
              userOpt.map {
                user => Future.successful(Right(UserRequest(user, request)))
              }.getOrElse(Future.successful(Left(Unauthorized(Json.obj("error" -> "Unauthorized")))))
            }
          } yield result
        case None => Future.successful(Left(Unauthorized(Json.obj("erro" -> "Unauthorized"))))
      }
    }
  }

}
