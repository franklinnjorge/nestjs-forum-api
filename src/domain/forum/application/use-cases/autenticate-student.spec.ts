import { makeStudent } from 'test/factories/make-student'
import { FakeEncrypter } from 'test/repositories/cryptography/fake-encrypter'
import { FakeHash } from 'test/repositories/cryptography/fake-hash'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { AuthenticateStudentUseCase } from './authenticate-student'

let inMemoryStudentRepository: InMemoryStudentsRepository
let fakeHash: FakeHash
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase
describe('AuthenticateStudentUseCase', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentsRepository()
    fakeHash = new FakeHash()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentRepository,
      fakeHash,
      fakeEncrypter
    )
  })

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'franklin-teste@example.com',
      password: await fakeHash.hash('123456')
    })

    inMemoryStudentRepository.items.push(student)

    const result = await sut.execute({
      email: 'franklin-teste@example.com',
      password: '123456'
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String)
    })
    expect(result)
  })
})
