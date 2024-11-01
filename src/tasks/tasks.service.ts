import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from 'src/dtos/create-task.dto';
import { UpdateTaskDto } from 'src/dtos/update-task.dto';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>
    ) {}


    async findAll(user: User): Promise<Task[]> {
        return this.tasksRepository.find({ where: { userId: user.id }});
    }


    async findTaskById(taskId: number): Promise<Task> {
        const task = await this.tasksRepository.findOne({ where: { id: taskId} })

        if(!task) throw new NotFoundException('Task not found');

        return task;
    }


    async createTask(user: User, taskData: CreateTaskDto): Promise<Task> {
        try {
            const task =  this.tasksRepository.create({
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
                userId: user.id,
            });

            return await this.tasksRepository.save(task);
        } catch (error) {
            throw new InternalServerErrorException('Task Creation Failed');
        }
    }

    async updateTask(taskId: number, taskData: UpdateTaskDto): Promise<Task> {
        const task = await this.findTaskById(taskId);

        console.log(task);



        try {
            const updateTask = Object.assign(task, taskData);

            console.log(updateTask)
            
            return await this.tasksRepository.save(updateTask);
        } catch (error) {
            throw new InternalServerErrorException('Failed to update Task');
        }
    }

    async delete(taskId: number) {
        const result = await this.tasksRepository.delete({ id: taskId });

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID: ${taskId} not found`);
        } 
    }



}
