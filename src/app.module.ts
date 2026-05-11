import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // ConfigModule: lee el archivo .env y lo expone como variables vía ConfigService.
    // isGlobal: true → no hace falta re-importarlo en cada módulo que lo use.
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // TypeOrmModule.forRootAsync: configura la conexión a Postgres leyendo del .env.
    // Es "Async" porque hay que esperar a que ConfigService cargue las variables.
    TypeOrmModule.forRootAsync({
      // inject: le pedimos a Nest que nos inyecte ConfigService en el useFactory.
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres', // motor de BD
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),

        // autoLoadEntities: detecta automáticamente las entidades registradas con
        // TypeOrmModule.forFeature([...]) en cada módulo. Más limpio que listarlas a mano.
        autoLoadEntities: true,
        
        // synchronize: si true, TypeORM crea/modifica tablas al arrancar según las entidades.
        // CÓMODO en dev; PELIGROSO en producción. Lo apagaremos al generar migraciones.
        synchronize: false,
      }),
    }),

    UsersModule,

    RolesModule,

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
