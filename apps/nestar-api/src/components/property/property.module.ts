import { forwardRef, Module } from '@nestjs/common';
import { PropertyResolver } from './property.resolver';
import { PropertyService } from './property.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import PropertySchema from '../../schemas/Property.model';
import { MemberModule } from '../member/member.module';
import { LikeModule } from '../like/like.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Property', schema: PropertySchema }]),
		AuthModule,
		ViewModule,
		forwardRef(() => MemberModule),
		LikeModule,
		NotificationModule,
	],
	providers: [PropertyResolver, PropertyService],
	exports: [PropertyService],
})
export class PropertyModule {}
