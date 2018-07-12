import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { StrataLogger } from 'services/strata_logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
