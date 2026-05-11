import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// bootstrap = función que arranca la app. Es async porque NestFactory.create devuelve una Promise.
async function bootstrap() {
  // Crea la instancia de la aplicación a partir del módulo raíz (AppModule).
  const app = await NestFactory.create(AppModule);

  // ValidationPipe activa la validación AUTOMÁTICA en TODOS los endpoints usando class-validator.
  // Sin esto, los decoradores @IsEmail(), @IsString(), etc. de los DTOs no funcionan.
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: elimina del body cualquier propiedad que NO esté declarada en el DTO.
      // Ej: si el DTO solo tiene "email" y mandas "email" + "hacker", "hacker" se borra.
      whitelist: true,

      // forbidNonWhitelisted: en vez de borrar las props extra, lanza error 400. Más estricto.
      forbidNonWhitelisted: true,

      // transform: convierte el body en una instancia de la clase DTO (no un objeto plano).
      // Esto permite que @Type() y conversiones de tipo funcionen (ej: string "5" → number 5).
      transform: true,
    }),
  );

  // Escucha en el puerto 3000 (o el que diga la variable PORT si existe).
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
