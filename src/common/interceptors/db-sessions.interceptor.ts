import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from "@nestjs/common";
import { Observable, from } from "rxjs";
import { DataSource } from "typeorm";

@Injectable()
export class DbSessionInterceptor implements NestInterceptor {
    constructor(private readonly dataSource: DataSource) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        const user = request.user; // from JWT/AuthGuard
        const ip = request.ip || request.connection?.remoteAddress;
        const api = `${request.method} ${request.originalUrl}`;

        return from(
            this.dataSource.query(
                ` SELECT
                set_config('app.current_user', $1, true),
                set_config('app.request_ip', $2, true),
                set_config('app.api_name', $3, true)
                `,
                [
                    user?.username || "system",
                    ip || "unknown",
                    api
                ]
            )
        ).pipe(() => next.handle());
    }
}
