import { Module } from '@nestjs/common';
import { NestarBatchController } from './batch.controller';
import { ConfigModule } from '@nestjs/config';
import { BatchService } from './batch.service';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../nestar-api/src/schemas/Member.model';
import PropertySchema from '../../nestar-api/src/schemas/Property.model';

@Module({
	imports: [
		ConfigModule.forRoot(),
		DatabaseModule,
		ScheduleModule.forRoot(),
		MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
		MongooseModule.forFeature([{ name: 'Property', schema: PropertySchema }]),
	],
	controllers: [NestarBatchController],
	providers: [BatchService],
})
export class BatchModule {}
