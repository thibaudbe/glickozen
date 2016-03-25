package models

import play.api.libs.json.{Json, OFormat}
import utils.Repository


case class User(
  email: String,
  name: String,
  google_token: String
)

object User extends Repository[User] {
  val collectionName: String = "users"
  implicit val format: OFormat[User]  = Json.format[User].asInstanceOf[OFormat[User]]
}

