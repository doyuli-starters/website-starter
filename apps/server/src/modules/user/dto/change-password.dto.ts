import { changePasswordSchema } from '@website-starter/shared'
import { createZodDto } from 'nestjs-zod'

export class ChangePasswordDto extends createZodDto(changePasswordSchema) {}
