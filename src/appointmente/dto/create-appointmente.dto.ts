import { IsNotEmpty, IsString } from "class-validator";

export class CreateAppointmenteDto {

    @IsNotEmpty()
    date: Date;

    @IsNotEmpty()
    @IsString()
    reason: string;
    
    @IsNotEmpty()
    @IsString()
    doctor_id: string;


}
