import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { AuthenticationController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreationQuestionController } from './controllers/create-question.controller'
import { FetchQuestionListController } from './controllers/fetch-question-list.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticationController,
    CreationQuestionController,
    FetchQuestionListController
  ]
})
export class HttpModule {}
