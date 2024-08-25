import { StudentsRepository } from '@/domain/forum/application/repositories/student-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  constructor() {}

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find(
      (student) => student.email.toString() === email
    )

    if (!student) {
      return null
    }

    return student
  }

  async create(student: Student) {
    this.items.push(student)
  }
}
