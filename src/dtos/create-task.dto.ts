import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { TaskStatus } from "src/enums/task-status.enum";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsEnum(TaskStatus)
    status: TaskStatus
}