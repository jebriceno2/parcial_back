import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './users/entities/user.entity';
import { Role } from './roles/entitites/roles.entity';

config(); // carga el .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  // Lista de entidades para que TypeORM sepa cómo lucen las tablas
  entities: [User, Role],

  // Carpeta donde se generarán las migraciones
  migrations: ['src/migrations/*.ts'],

  // synchronize: false ← OBLIGATORIO en migraciones. Si estuviera true,
  // TypeORM crearía las tablas en cada arranque y la migración no haría nada.
  synchronize: false,
});
