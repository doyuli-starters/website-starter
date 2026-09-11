import { registerSchema } from '@__name__/shared'
import { createZodDto } from 'nestjs-zod'

export class RegisterDto extends createZodDto(registerSchema) {}
