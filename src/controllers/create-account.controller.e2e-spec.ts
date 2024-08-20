import { AppModule } from '@/app.module'
import PrismaService from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create account (E2E', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/account').send({
      name: 'Franklin Test',
      email: 'franklin.test@test.com',
      password: 'test-password'
    })

    expect(response.statusCode).toBe(201)

    const userExist = prisma.user.findUnique({
      where: {
        email: 'franklin.test@test.com'
      }
    })

    expect(userExist).toBeTruthy()
  })
})
