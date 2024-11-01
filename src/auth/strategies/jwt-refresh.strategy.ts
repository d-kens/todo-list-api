import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import { TokenPayload } from "../token-payload.interface";
import { AuthService } from "../auth.service";


@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {

    constructor(private readonly authSerivice: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request.cookies?.RefreshToken,
            ]),
            secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
            passReqToCallback: true
        })
    }


    async validate(request: Request, payload: TokenPayload) {
        return await this.authSerivice.verifyUserRefreshToken(request.cookies?.RefreshToken, payload.userId)
    }
 
}