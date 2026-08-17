import { Controller, Get } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { HOSTS, PRODUCT_NAME } from '@getpersona/shared';

@AllowAnonymous()
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
