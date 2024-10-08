import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { Permission } from './permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),

  ],
  controllers: [PermissionController],
  providers: [PermissionService]
})
export class PermissionModule {}
