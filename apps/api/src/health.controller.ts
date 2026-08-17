import { Controller, Get } from '@nestjs/common';
import { HOSTS, PRODUCT_NAME } from '@getpersona/shared';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      product: PRODUCT_NAME,
      hosts: HOSTS,
    };
  }
}
