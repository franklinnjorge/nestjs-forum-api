import { Module } from '@nestjs/common'
import { AuthenticationController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreationQuestionController } from './controllers/create-question.controller'
import { FetchQuestionListController } from './controllers/fetch-question-list.controller'
import PrismaService from '../database/prisma/prisma.service'

@Module({
  controllers: [
    CreateAccountController,
    AuthenticationController,
    CreationQuestionController,
    FetchQuestionListController
  ],
  providers: [PrismaService]
})
export class HttpModule {}
