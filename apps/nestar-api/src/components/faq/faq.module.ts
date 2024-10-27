import { Module } from '@nestjs/common';
import { FaqResolver } from './faq.resolver';
import { FaqService } from './faq.service';
import { MongooseModule } from '@nestjs/mongoose';
import NoticeSchema from '../../schemas/Notice.model';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'FAQ',
				schema: NoticeSchema,
			},
		]),
		AuthModule,
	],

	providers: [FaqResolver, FaqService],
	exports: [FaqService],
})
export class FaqModule {}
