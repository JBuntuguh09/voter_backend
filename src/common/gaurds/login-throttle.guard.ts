import { Injectable } from '@nestjs/common'
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler'

@Injectable()
export class LoginThrottleGuard extends ThrottlerGuard{
    protected async getTracker(req: Record<string, any>): Promise<string> {
        const email = req.body?.email || 'anonymous'

        return `login-${email}`
    }

    protected  getLimit(): Promise<number>{
        return Promise.resolve(3)
    }

    protected getTtl(): Promise<number>{
        return Promise.resolve(60000)
    }

    protected async throwThrottlingException(): Promise<void> {
        throw new ThrottlerException('Too many attempts. Try again in a minute')
    }
}