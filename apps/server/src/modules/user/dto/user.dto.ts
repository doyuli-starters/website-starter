import { updateUserSchema } from '@website-starter/shared'
import { createZodDto } from 'nestjs-zod'

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
