import { Module } from '@nestjs/common';
import { NestarBatchController } from './batch.controller';
import { ConfigModule } from '@nestjs/config';
import { BatchService } from './batch.service';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../nestar-api/src/schemas/Member.model';
import PetSchema from '../../nestar-api/src/schemas/Pet.model';

@Module({
	imports: [
		ConfigModule.forRoot(),
		DatabaseModule,
		ScheduleModule.forRoot(),
		MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
		MongooseModule.forFeature([{ name: 'Pet', schema: PetSchema }]),
	],
	controllers: [NestarBatchController],
	providers: [BatchService],
})
export class BatchModule {}
