import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { RESPONSE_CODES } from '../constants/index.js'
import { ResponseDto } from '../dto/response.dto.js'

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseDto<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto<T>> {
    const request = context.switchToHttp().getRequest()
    return next
      .handle()
      .pipe(
        map(
          data =>
            new ResponseDto(
              RESPONSE_CODES.SUCCESS.code,
              RESPONSE_CODES.SUCCESS.message,
              data,
              request.url,
            ),
        ),
      )
  }
}
