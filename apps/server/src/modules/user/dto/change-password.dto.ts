import { changePasswordSchema } from '@__name__/shared'
import { createZodDto } from 'nestjs-zod'

export class ChangePasswordDto extends createZodDto(changePasswordSchema) {}
