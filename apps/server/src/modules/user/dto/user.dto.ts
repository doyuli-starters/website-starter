import { updateUserSchema } from '@__name__/shared'
import { createZodDto } from 'nestjs-zod'

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
