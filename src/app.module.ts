import { Module } from '@nestjs/common'
import PrismaService from './prisma/prisma.service'
import { CreateAccountController } from './controllers/create-account.controller'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { AuthenticationController } from './controllers/authenticate.controller'
import { CreationQuestionController } from './controllers/create-question.controller'
import { FetchQuestionListController } from './controllers/fetch-question-list.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true
    }),
    AuthModule
  ],
  controllers: [
    CreateAccountController,
    AuthenticationController,
    CreationQuestionController,
    FetchQuestionListController
  ],
  providers: [PrismaService]
})
export class AppModule {}
