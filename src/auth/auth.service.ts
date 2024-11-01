import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { Response } from 'express';
import * as process from 'process';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/dtos/create-user.dto';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async register(userData: CreateUserDto) {
        return await this.usersService.createUser(userData);
    }

    async login(user: User, response: Response) {
        const expiresAccessToken = new Date();
        expiresAccessToken.setTime(expiresAccessToken.getTime() + parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS));

        const expiresRefreshoken = new Date();
        expiresRefreshoken.setTime(expiresRefreshoken.getTime() + parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS));

        const tokenPayload: TokenPayload = {
            userId: user.id
        };

        
        const acessToken = this.jwtService.sign(tokenPayload, {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS}ms`
        });

        const refreshToken = this.jwtService.sign(tokenPayload, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_MS}ms`
        });

        await this.usersService.updateUser(user.id, {...user, refreshToken:  await bcrypt.hash(refreshToken, 10)})

        response.cookie('AccessToken', acessToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            expires: expiresAccessToken
        });

        response.cookie('RefreshToken', refreshToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            expires: expiresRefreshoken
        })
    }


    async validateUser(email: string, password: string) {
        try {
            const user = await this.usersService.findUserByEmail(email);

            if(!user) throw new UnauthorizedException('Invalid credentials')

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if(!isPasswordValid) {
                throw new UnauthorizedException('invalid credentials')
            }

            return user;

        } catch(error) {
            throw new UnauthorizedException('Credentials are not valid');
        }
    }

    async verifyUserRefreshToken(refreshToken: string, userId: number) {
        try {

            const user = await this.usersService.findUserById(userId);

            const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);

            if(!isRefreshTokenValid) {
                throw new UnauthorizedException();
            }

            return user;

        } catch (error) {
            throw new UnauthorizedException('Refresh token is not valid')
        }
    }

}
