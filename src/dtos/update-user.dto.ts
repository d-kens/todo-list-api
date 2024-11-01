import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsString()
    @MinLength(8)
    @IsOptional()
    password?: string

    @IsString()
    @IsOptional()
    refreshToken?: string
}