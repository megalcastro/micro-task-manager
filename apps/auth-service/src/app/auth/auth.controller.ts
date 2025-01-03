import { Controller, Post, Body, Get, UnauthorizedException , Headers} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Get('validate-token')
  async validateToken(@Headers('Authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Token is required');
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const user = await this.authService.validateToken(token);
      return { valid: true, user };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
