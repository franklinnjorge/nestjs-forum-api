import { AppModule } from '@/infra/app.module'
import PrismaService from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch Question lIST (E2E)', () => {
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

  test('[GET] /question', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Franklin Test',
        email: 'franklin.test@test.com',
        password: '123456'
      }
    })

    await prisma.question.create({
      data: {
        title: 'new Question',
        content: 'new content',
        slug: 'new-question',
        authorId: user.id
      }
    })

    await prisma.question.create({
      data: {
        title: 'new Question 2',
        content: 'new content',
        slug: 'new-question-2',
        authorId: user.id
      }
    })

    const accessToken = jwtService.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'new Question' }),
        expect.objectContaining({ title: 'new Question 2' })
      ]
    })
  })
})
