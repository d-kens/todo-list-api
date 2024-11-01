import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { UserResponseDto } from 'src/dtos/user-response.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}
    
    async findAll() {
        return await this.userRepository.find();
    }

    async findUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });

        if(!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async findUserByEmail(email: string): Promise<User | null> {

        const user = await this.userRepository.findOne({ where: { email } });

        return user;
    }

    async createUser(userData: CreateUserDto): Promise<UserResponseDto> {
        const user = await this.findUserByEmail(userData.email);

        if(user) throw new ConflictException('Email already in use');
    
        try {
            const savedUser = await this.userRepository.save({
                ...userData,
                password: await hash(userData.password, 10)
            });

            return new UserResponseDto(savedUser)
        } catch (error) {
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async updateUser(id: number, userData: UpdateUserDto): Promise<User> {
        const user = await this.findUserById(id);

        try {
            const updatedUser = Object.assign(user, userData);
            return this.userRepository.save(updatedUser);
        } catch (error) {
            throw new InternalServerErrorException('Failed to update user');
        }
    }


    async deleteUser(id: number) {
        const result = await this.userRepository.delete({ id });

        if (result.affected === 0) {
            throw new NotFoundException(`User with ID: ${id} not found`);
        }
    }
}
