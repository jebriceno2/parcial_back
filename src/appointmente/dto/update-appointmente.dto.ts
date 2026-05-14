import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmenteDto } from './create-appointmente.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateAppointmenteDto extends PartialType(CreateAppointmenteDto) {
    @IsNotEmpty()
    status: string;

}
