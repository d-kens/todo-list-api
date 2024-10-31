import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { CreateUserDto } from 'src/dtos/create-user.dto';
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

    async findUserById(id: number) {
    }

    async findUserByEmail(email: string): Promise<User> {

        const user = await this.userRepository.findOne({ where: { email } });

        if(!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async createUser(userData: CreateUserDto): Promise<User> {
        return await this.userRepository.save({
            ...userData,
            password: await hash(userData.password, 10)
        });
    }

    async updateUser(id: number, userData: any){

    }


    async deleteUser() {

    }
}
