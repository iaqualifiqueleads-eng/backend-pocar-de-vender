import { Module } from '@nestjs/common';
import { PerdaService } from './perda.service';
import { PerdaController } from './perda.controller';

@Module({
  controllers: [PerdaController],
  providers: [PerdaService],
})
export class PerdaModule {}
