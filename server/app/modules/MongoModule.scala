package modules

import com.google.inject.AbstractModule
import models.db.DbSetup

class MongoModule extends AbstractModule {
  def configure() = {
    bind(classOf[DbSetup]).asEagerSingleton()
  }
}
