import { AppModule } from '@/infra/app.module'
import PrismaService from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /question', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Franklin Test',
        email: 'franklin.test@test.com',
        password: '123456'
      }
    })

    const accessToken = jwtService.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'new Question',
        content: 'new content',
        authorId: user.id
      })

    expect(response.statusCode).toBe(201)

    const questionExist = prisma.question.findFirst({
      where: {
        title: 'new Question'
      }
    })

    expect(questionExist).toBeTruthy()
  })
})
