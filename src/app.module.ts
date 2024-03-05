import { AppController } from './app.controller';

import { Module } from '@nestjs/common';
import { AllModules, AllProviders } from './module-index';

@Module({
  imports: [
    ...AllModules
  ],
  controllers: [AppController],
  providers: [...AllProviders],
})
export class AppModule {}
