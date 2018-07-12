import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import { Actor } from './actor.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Actor])],
    controllers: [ActorController],
    providers: [ActorService],
    exports: [ActorModule],
})
export class ActorModule {}