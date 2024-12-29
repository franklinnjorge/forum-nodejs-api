import { UsersRepository } from '@/repositories/users-repository'
import bcryptjs from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'

export interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await bcryptjs.hash(password, 6)
    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.userRepository.create({
      name,
      email,
      password_hash,
    })

    return {
      user,
    }
  }
}
