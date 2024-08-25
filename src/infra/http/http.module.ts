import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { AuthenticationController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreationQuestionController } from './controllers/create-question.controller'
import { FetchQuestionListController } from './controllers/fetch-question-list.controller'
import { CryptographyModule } from '../cryptography/crytptography.module'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticationController,
    CreationQuestionController,
    FetchQuestionListController
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase
  ]
})
export class HttpModule {}
