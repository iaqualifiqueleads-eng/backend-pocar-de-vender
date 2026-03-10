import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LogsErrorsController } from "./logs-errors.controller";
import { LogsErrorsService } from "./logs-errors.service";
import { JwtService } from "@nestjs/jwt";
import { LogsEntity } from "./entities/logs.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([LogsEntity]),
  ],
  controllers: [LogsErrorsController],
  providers: [LogsErrorsService, JwtService],
  exports: [LogsErrorsService],
})
export class LogsErrorsModule { }