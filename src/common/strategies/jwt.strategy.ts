import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from 'src/auth/auth.service';


@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.API_SECRET || "my secret"
        })
    }
    async validate(payload: any) {
        try {
            const user = await this.authService.findByUserId(payload.userId)

            return {
                ...user,
                user_id:payload.userId
                 
            }
        } catch (error) {
            throw new UnauthorizedException('Invalid token')
        }
    }
}