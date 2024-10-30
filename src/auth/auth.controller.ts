import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dtos/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
   
    @Post('signup')
    async signUp(@Body() signUpdata: CreateUserDto) {
        return this.authService.signup(signUpdata);
    }

    /**
     * TODO: POST Login
     */
    @Post('login')
    async login(@Body() loginData: LoginDto) {
        return this.authService.signin(loginData);
    }


    /**
     * TODO: POST Refresh Token 
     */

    /**
     * TODO: GET Return the Current Authenticated User
     */
}
