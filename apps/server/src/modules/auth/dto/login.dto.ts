import { loginSchema } from '@__name__/shared'
import { createZodDto } from 'nestjs-zod'

export class LoginDto extends createZodDto(loginSchema) {}
