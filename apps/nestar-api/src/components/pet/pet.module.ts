import { forwardRef, Module } from '@nestjs/common';
import { PetResolver } from './pet.resolver';
import { PetService } from './pet.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { MemberModule } from '../member/member.module';
import { LikeModule } from '../like/like.module';
import { NotificationModule } from '../notification/notification.module';
import PetSchema from '../../schemas/Pet.model';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Pet', schema: PetSchema }]),
		AuthModule,
		ViewModule,
		forwardRef(() => MemberModule),
		LikeModule,
		NotificationModule,
	],
	providers: [PetResolver, PetService],
	exports: [PetService, MongooseModule],
})
export class PetModule {}
