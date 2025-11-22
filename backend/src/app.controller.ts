import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth(): object {
    return {
      status: 'ok',
      message: 'Watch Passport API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
