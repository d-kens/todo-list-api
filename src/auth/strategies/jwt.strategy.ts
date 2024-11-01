import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy, ExtractJwt } from 'passport-jwt'
import * as process from 'process';
import { TokenPayload } from "../token-payload.interface";
import { UsersService } from "src/users/users.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {


    constructor(private readonly userSerivice: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request.cookies?.AccessToken,
            ]),
            secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET
        })
    }


    async validate(payload: TokenPayload) {
      return this.userSerivice.findUserById(payload.userId);
    }


}