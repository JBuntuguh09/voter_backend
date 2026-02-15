import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly STATIC_TOKEN = process.env.STATIC_API_TOKEN;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');

      // ✅ Allow static token
      if (token === this.STATIC_TOKEN) {
        return true;
      }
    }

    // 🔐 Otherwise fall back to normal JWT validation
    const result = (await super.canActivate(context)) as boolean;

    if (!result) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
