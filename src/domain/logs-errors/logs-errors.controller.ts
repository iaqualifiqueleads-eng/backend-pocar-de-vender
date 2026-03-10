import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "src/common/guards/jwt.guard";
import { SystemIdGuard } from "src/common/guards/system-id.guard";
import { LogsErrorsService } from "./logs-errors.service";
import { CreateLogDto } from "./dto/create-log.dto";

@Controller('logs')
@ApiTags('logs')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtGuard)
@UseGuards(SystemIdGuard)
@ApiHeader({
  name: 'x-system-id',
  example: 'pocar_de_vender_0',
  description: 'ID do sistema',
  required: true,
})
export class LogsErrorsController {
  constructor(private readonly logsService: LogsErrorsService) { }

  @Post()
  create(@Body() data: CreateLogDto, @Req() req: Request) {
    return this.logsService.create(req["systemId"], data)
  }
}