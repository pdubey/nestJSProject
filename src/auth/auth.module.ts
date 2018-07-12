import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpStrategy } from './http.strategy';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorToken } from './actor_token.entity';
import { ActorModule } from 'actor/actor.module';

@Module({
    imports: [TypeOrmModule.forFeature([ActorToken]), ActorModule],
    controllers: [AuthController],
    providers: [AuthService, HttpStrategy],
    exports: [AuthModule],
})
export class AuthModule {}