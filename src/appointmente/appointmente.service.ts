import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointmente } from './entities/appointmente.entity';
import { User } from '../users/entities/user.entity';
import { CreateAppointmenteDto } from './dto/create-appointmente.dto';
import { UpdateAppointmenteDto } from './dto/update-appointmente.dto';

@Injectable()
export class AppointmenteService {
  constructor(
    @InjectRepository(Appointmente)
    private readonly appsRepo: Repository<Appointmente>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  // ─── POST /appointments ───────────────────────────────────────────────
  async create(dto: CreateAppointmenteDto, currentUserId: string) {
    // 1) El doctor del body debe existir
    const doctor = await this.usersRepo.findOne({
      where: { id: dto.doctor_id },
    });
    if (!doctor) throw new NotFoundException('Doctor no encontrado');

    // 2) Ese user debe tener rol 'doctor'
    const esDoctor = doctor.roles.some((r) => r.role_name === 'doctor');
    if (!esDoctor) {
      throw new BadRequestException(
        'El doctor especificado no tiene rol doctor',
      );
    }

    const fechaCita = new Date(dto.date);

    // 3) El paciente es el user actual (lo saca el controller del JWT)
    const patient = await this.usersRepo.findOne({
      where: { id: currentUserId },
    });
    if (!patient) throw new NotFoundException('Paciente no encontrado');

    // 4) Crear y guardar
    const cita = this.appsRepo.create({
      date: fechaCita,
      reason: dto.reason,
      patient,
      doctor,
      // status se queda en 'pending' por el default de la entidad
    });
    const saved = await this.appsRepo.save(cita);

    return { message: 'Cita agendada', appointmentId: saved.id };
  }

  // ─── GET /appointments/me ────────────────────────────────────────────
  async findMine(userId: string) {
    // Array en `where` = OR. Trae citas donde el user es paciente O doctor.
    return this.appsRepo.find({
      where: [{ patient: { id: userId } }, { doctor: { id: userId } }],
    });
  }

  // ─── GET /appointments  (admin) ──────────────────────────────────────
  async findAll() {
    return this.appsRepo.find();
  }

  // ─── PATCH /appointments/:id/complete  (doctor) ──────────────────────
  async complete(appointmentId: string, currentUserId: string, dto: UpdateAppointmenteDto) {
    const cita = await this.appsRepo.findOne({ where: { id: appointmentId } });
    if (!cita) throw new NotFoundException('Cita no encontrada');

    // Solo el doctor asignado a ESTA cita puede completarla
    if (cita.doctor.id !== currentUserId) {
      throw new ForbiddenException('No eres el doctor asignado a esta cita');
    }

    // No puedes completar una cita ya completada o cancelada
    if (cita.status !== 'pending') {
      throw new ConflictException('La cita ya fue completada o cancelada');
    }

    cita.status = dto.status;
    await this.appsRepo.save(cita);
    return { message: 'Cita completada' };
  }

  // ─── DELETE /appointments/:id  (paciente dueño o admin) ──────────────
  async cancel(
    appointmentId: string,
    currentUserId: string,
  ) {
    const cita = await this.appsRepo.findOne({ where: { id: appointmentId } });
    if (!cita) throw new NotFoundException('Cita no encontrada');

    const esPacienteDueno = cita.patient.id === currentUserId;
    if (!esPacienteDueno) {
      throw new ForbiddenException('No puedes cancelar esta cita');
    }
    await this.appsRepo.delete(cita);
    return { message: 'Cita cancelada' };
  }
}
