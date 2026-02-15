import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap, catchError, throwError } from "rxjs";
import { ActivityLogsService } from "./activity-logs.service";

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(
    private readonly logService: ActivityLogsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const method = request.method;
    const url = request.originalUrl || request.url;
    const user = request.user;
    const ip =
      request.headers["x-forwarded-for"] ||
      request.socket?.remoteAddress;
    const userAgent = request.headers["user-agent"];
    const route = request.route?.path || null;

    return next.handle().pipe(
      tap(() => {
        // Fire-and-forget (doesn't slow API)
        setImmediate(() => {
          this.logService.log({
            action: `${method} ${url}`,
            url,
            method,
            userAgent,
            statusCode: response.statusCode?.toString(),
            ipAddress: ip?.toString(),
            route,
            result: "success",
            responseTime: `${Date.now() - startTime}ms`,
            user,
            createdBy: user?.username || "system",
          });
        });
      }),

      catchError((error) => {
        setImmediate(() => {
          this.logService.log({
            action: `${method} ${url}_FAILED`,
            url,
            method,
            userAgent,
            statusCode: error?.status?.toString() || "500",
            ipAddress: ip?.toString(),
            route,
            result: "failure",
            responseTime: `${Date.now() - startTime}ms`,
            user,
            createdBy: user?.username || "system",
          });
        });

        return throwError(() => error);
      }),
    );
  }
}
