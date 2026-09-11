import { HttpException, HttpStatus } from '@nestjs/common'

export class BusinessException extends HttpException {
  constructor(
    public readonly code: number,
    public readonly message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ code, message }, statusCode)
  }
}

export class AuthException extends HttpException {
  constructor(
    public readonly code: number,
    public readonly message: string,
    statusCode: HttpStatus = HttpStatus.UNAUTHORIZED,
  ) {
    super({ code, message }, statusCode)
  }
}
