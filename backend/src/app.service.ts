import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'OK',
      service: 'CSR Order & Bill System',
      timestamp: new Date().toISOString(),
    };
  }

  getHello(): string {
    return 'CSR Order & Bill System';
  }
}
