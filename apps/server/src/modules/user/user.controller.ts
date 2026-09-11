import { Body, Controller, Get, Patch } from '@nestjs/common'
import { CurrentUser } from '#/common/decorators/current-user.decorator.js'
import { ChangePasswordDto } from './dto/change-password.dto.js'
import { UserService } from './user.service.js'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@CurrentUser('id') id: string) {
    return this.userService.findOne(id)
  }

  @Patch('password')
  changePassword(
    @CurrentUser('id') id: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(id, dto)
  }
}
