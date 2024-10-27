import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import NotificationSchema from '../../schemas/Notification.model';
import { NotificationService } from './notification.service';
import { MemberModule } from '../member/member.module';
import { NotificationResolver } from './notification.resolver';
import { LikeModule } from '../like/like.module';
import { AuthModule } from '../auth/auth.module';
import { CommentModule } from '../comment/comment.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Notify',
				schema: NotificationSchema,
			},
		]),
		forwardRef(() => MemberModule),
		AuthModule,
	],
	providers: [NotificationService, NotificationResolver],
	exports: [NotificationService],
})
export class NotificationModule {}
