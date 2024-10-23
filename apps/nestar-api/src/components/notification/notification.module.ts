import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import NotificationSchema from '../../schemas/Notification.model';
import { NotificationService } from './notification.service';
import { MemberModule } from '../member/member.module';
import { NotificationResolver } from './notification.resolver';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Notify',
				schema: NotificationSchema,
			},
		]),
		forwardRef(() => MemberModule),
	],
	providers: [NotificationService, NotificationResolver],
	exports: [NotificationService],
})
export class NotificationModule {}
