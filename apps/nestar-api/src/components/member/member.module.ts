import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.model';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { MemberService } from './member.service';
import { MemberResolver } from './member.resolver';
import { LikeModule } from '../like/like.module';
import FollowSchema from '../../schemas/Follow.model';
import { NotificationModule } from '../notification/notification.module';
import NotificationSchema from '../../schemas/Notification.model';
import { PetModule } from '../pet/pet.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
		MongooseModule.forFeature([{ name: 'Follow', schema: FollowSchema }]),

		AuthModule,
		ViewModule,
		LikeModule,
		forwardRef(() => PetModule),
		forwardRef(() => NotificationModule),
		forwardRef(() => LikeModule),
	],

	providers: [MemberResolver, MemberService],
	exports: [MemberService, MongooseModule],
})
export class MemberModule {}
