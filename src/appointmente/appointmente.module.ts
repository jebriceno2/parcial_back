import { Module } from '@nestjs/common';
import { AppointmenteService } from './appointmente.service';
import { AppointmenteController } from './appointmente.controller';
import { User } from 'src/users/entities/user.entity';
import { Appointmente } from './entities/appointmente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Appointmente, User])],
  controllers: [AppointmenteController],
  providers: [AppointmenteService],
  exports: [AppointmenteService],
})
export class AppointmenteModule {}
