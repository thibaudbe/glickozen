package models.db

import javax.inject.Inject

import models.User
import play.api.libs.json._
import play.modules.reactivemongo.ReactiveMongoApi
import play.modules.reactivemongo.json._
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.{ExecutionContext, Future}
import scala.io.Source

class DbSetup @Inject()(
  implicit
  reactiveMongoApi: ReactiveMongoApi,
  executionContext: ExecutionContext
) {

  val load = for {
    _ <- installUsers()
  } yield ()

  def installUsers() = {
    val usersFileContent = Source.fromFile("conf/db/users.json").getLines().mkString("\n")
    val users = (Json.parse(usersFileContent) \ "users").asOpt[Seq[JsValue]] match {
      case Some(values) => values.flatMap(value => User.format.reads(value).asOpt)
      case _ => Nil
    }
    installResource[User]("users", users)(User.format)
  }

  def installResource[T](collectionName: String, elements: Seq[T])(implicit format: OFormat[T]) = {
    val collection = reactiveMongoApi.db[JSONCollection](collectionName)
    (for {
      collectionElements <- collection.find(Json.obj()).cursor[T]().collect[Seq]()
      appended <- if (collectionElements.isEmpty) Future.sequence(elements.map(element => collection.insert(element)))
           else Future.successful(Nil)
    } yield {
      println(s"Successfully installed ${ appended.length } documents in $collectionName.")
    }) recover { case e =>
      println(s"Error while installing collection $collectionName: $e")
    }
  }

}
