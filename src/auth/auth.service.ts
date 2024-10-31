import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from 'src/dtos/user-response.dto';
import { LoginDto } from 'src/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService) { }


    async validateUser(email: string, password: string) {
        try {
            const user = await this.usersService.findUserByEmail(email);

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if(!isPasswordValid) {
                throw new UnauthorizedException('invalid credentials')
            }

        } catch(error) {
            throw new UnauthorizedException('Credentials are not valid');
        }
    }

}
