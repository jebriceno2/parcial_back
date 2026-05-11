import { IsEmail, IsString, MinLength, IsOptional, IsArray, Min } from "class-validator";

export class RegisterDto{
    @IsEmail()
    readonly email: string;

    @IsString()
    @MinLength(6)
    readonly password: string;

    @IsString()
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly phone: string;

    @IsString({each: true})
    @IsArray()
    @IsOptional()
    readonly roles: string[];

}