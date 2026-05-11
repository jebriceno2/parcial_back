import { IsArray, ArrayNotEmpty, IsString } from "class-validator";

export class AssignRolesDto {

    @IsString({each: true})
    @IsArray()
    @ArrayNotEmpty()
    readonly roles: string[];
}