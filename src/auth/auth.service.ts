import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from 'src/dtos/user-response.dto';
import { LoginDto } from 'src/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async signin(credentials: LoginDto) {
        const { email, password } = credentials;

        const user = await this.usersService.findUserByEmail(email);

        if(!user) {
            throw new UnauthorizedException('Invalid Credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            throw new UnauthorizedException('Invalid Credentials');
        }

        return this.generateToken(user.id)
    }

    async signup(signUpData: CreateUserDto) {
        const { name, email, password } = signUpData

        const emailExists = await this.usersService.findUserByEmail(email);

        if(emailExists) {
            throw new ConflictException(`User with email: ${email} already exists`)
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.usersService.createUser({
            name,
            email,
            password: hashedPassword
        });

        return new UserResponseDto(newUser);
    }

    private async generateToken(userId) {
        const accessToken = this.jwtService.sign({userId}, {expiresIn: '1h'});

        return accessToken;
    }

}
