import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from 'src/dtos/user-response.dto';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService) {}

    async signin(email: string, password: string) {
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

}
