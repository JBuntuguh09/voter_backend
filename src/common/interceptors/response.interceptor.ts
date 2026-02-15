import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        // If the handler already returned a structured response, leave it as-is
        if (
          data &&
          typeof data === 'object' &&
          ('status' in data || 'code' in data || 'message' in data)
        ) {
          return data;
        }

        return {
          status: true,
          code: response.statusCode || 200,
          message: 'Request successful',
          data,
        };
      }),
    );
  }
}
