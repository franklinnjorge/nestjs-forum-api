import { Either, left, right } from '@/core/either'
import { Student } from '../../enterprise/entities/student'
import { HashGenerator } from '../cryptography/hash-generator'
import { StudentsRepository } from '../repositories/student-repository'
import { StudentAlreadyExistError } from './errors/student-already-exist-error'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistError,
  {
    student: Student
  }
>

export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    name,
    email,
    password
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithTheSameEmail =
      await this.studentsRepository.findByEmail(email)

    if (studentWithTheSameEmail) {
      return left(new StudentAlreadyExistError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      password: hashedPassword
    })

    await this.studentsRepository.create(student)

    return right({
      student
    })
  }
}
