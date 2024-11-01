import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { CreateTaskDto } from 'src/dtos/create-task.dto';
import { UpdateTaskDto } from 'src/dtos/update-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(
        @CurrentUser() user: User
    ) {
        return await this.taskService.findAll(user)
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findById(@Param('id') id: number) {
        return await this.taskService.findTaskById(id)
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createTask(
        @CurrentUser() user: User,
        @Body() taskData: CreateTaskDto
    ) {
        return await this.taskService.createTask(user, taskData)
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateTask(
        @Param('id') id: number,
        @Body() taskData: UpdateTaskDto
    ) {
        return this.taskService.updateTask(id, taskData)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id: number) {
        await this.taskService.delete(id)
    }

}
