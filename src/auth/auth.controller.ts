import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dtos/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
}
