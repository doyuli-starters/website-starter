import { loginSchema } from '@website-starter/shared'
import { createZodDto } from 'nestjs-zod'

export class LoginDto extends createZodDto(loginSchema) {}
