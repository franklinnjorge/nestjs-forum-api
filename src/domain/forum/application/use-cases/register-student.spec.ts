import { FakeHash } from 'test/repositories/cryptography/fake-hash'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { RegisterStudentUseCase } from './register-student'

let inMemoryStudentRepository: InMemoryStudentsRepository
let fakeHash: FakeHash
let sut: RegisterStudentUseCase
describe('RegisterStudentUseCase', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentsRepository()
    fakeHash = new FakeHash()
    sut = new RegisterStudentUseCase(inMemoryStudentRepository, fakeHash)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'Franklin',
      password: await fakeHash.hash('123456'),
      email: 'franklin-teste@example.com'
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentRepository.items[0]
    })
  })
})
