import { Controller, Post, Body, Patch, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SinginAuthDto } from './dto/singin-auth.dto';
import { ChangePasswordDto } from './dto/change-pasword.dto';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { SystemIdGuard } from 'src/common/guards/system-id.guard';
import { LoginResponseDto } from './dto/login.response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
@ApiTags('Auth')
// @UseGuards(SystemIdGuard)
// @ApiHeader({
//   name: 'x-system-id',
//   example: 'pocar_de_vender_0',
//   description: 'ID do sistema',
//   required: true,
// })
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: 'Retorna JWT válido para autenticação.' })
  @ApiOkResponse({ type: LoginResponseDto })
  @UseGuards(SystemIdGuard)
  @ApiHeader({
    name: 'x-system-id',
    example: 'pocar_de_vender_0',
    description: 'ID do sistema',
    required: false,
  })
  singIn(
    @Req() req: Request,
    @Body() singinAuthDto: SinginAuthDto
  ) {
    return this.authService.signIn({
      systemId: req["systemId"],
      singinAuthDto
    }
    );
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtGuard)
  @Patch('change-password')
  @ApiOperation({ summary: 'Muda a senha do usuário.' })
  @ApiOkResponse({ type: LoginResponseDto })
  @UseGuards(SystemIdGuard)
  @ApiHeader({
    name: 'x-system-id',
    example: 'pocar_de_vender_0',
    description: 'ID do sistema',
    required: true,
  })
  changePassword(@Req() req: Request, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req["systemId"], changePasswordDto);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtGuard)
  @Patch('reset-password')
  @ApiOperation({ summary: 'Muda a senha do usuário para senha padrão.' })
  @ApiOkResponse({ type: LoginResponseDto })
  @UseGuards(SystemIdGuard)
  @ApiHeader({
    name: 'x-system-id',
    example: 'pocar_de_vender_0',
    description: 'ID do sistema',
    required: true,
  })
  resetPassword(@Req() req: Request, @Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(req["systemId"], resetPasswordDto);
  }
}
