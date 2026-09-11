import { registerSchema } from '@website-starter/shared'
import { createZodDto } from 'nestjs-zod'

export class RegisterDto extends createZodDto(registerSchema) {}
