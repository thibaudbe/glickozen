package models

import play.api.libs.json.{Json, OFormat}
import play.modules.reactivemongo.ReactiveMongoApi
import reactivemongo.api.commands.WriteResult
import utils.Repository

import scala.concurrent.Future


case class User(
  email: String,
  name: String,
  google_token: String
)

object User extends Repository[User] {
  val collectionName: String = "users"
  implicit val format: OFormat[User]  = Json.format[User].asInstanceOf[OFormat[User]]

  def upsertByEmail(user: User)(implicit reactiveMongoApi: ReactiveMongoApi): Future[WriteResult] = {
    upsert(Json.obj("email" -> user.email), user)
  }
}

