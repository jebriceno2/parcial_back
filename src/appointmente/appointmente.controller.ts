import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AppointmenteService } from './appointmente.service';
import { CreateAppointmenteDto } from './dto/create-appointmente.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateAppointmenteDto } from './dto/update-appointmente.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointmente')
export class AppointmenteController {
  constructor(private readonly service: AppointmenteService) {}

  // POST /appointments  → solo patient
  @Post()
  @Roles('pacient')
  create(@Body() dto: CreateAppointmenteDto, @Req() req) {
    return this.service.create(dto, req.user.id);
  }

  // GET /appointments/me  → cualquier autenticado
  @Get('me')
  findMine(@Req() req) {
    return this.service.findMine(req.user.id);
  }

  // GET /appointments  → solo admin
  @Get()
  @Roles('admin')
  findAll() {
    return this.service.findAll();
  }

  // PATCH /appointments/:id/complete  → solo doctor
  @Patch(':id/complete')
  @Roles('doctor')
  complete(@Param('id', ParseUUIDPipe) id: string, @Req() req, @Body() dto: UpdateAppointmenteDto) {
    return this.service.complete(id, req.user.id, dto);
  }

  // DELETE /appointments/:id  → patient dueño o admin (validado en el service)
  @Delete(':id')
  cancel(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    return this.service.cancel(id, req.user.id);
  }
}
