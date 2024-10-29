import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

    async findUserByEmail(email: string): Promise<User | null> {
        try {
            return await this.userRepository.findOne({
                where: { email }
            });
        } catch (error) {
            throw new InternalServerErrorException(`Error fetching user`);
        }
    }

    async createUser(userData: CreateUserDto): Promise<User> {
        return await this.userRepository.save(userData);
    }

    async updateUser(id: number, userData: any){

    }


    async deleteUser() {

    }
}
