import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Notifies, Notify } from '../../libs/dto/notifyme/notifyme';
import { NotifInquiry } from '../../libs/dto/notifyme/notifyme.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { NotifUpdate } from '../../libs/dto/notifyme/notifyme.update';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';

@Resolver()
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

	@UseGuards(WithoutGuard)
	@Query((returns) => Notifies)
	public async getNotifications(
		@Args('input') input: NotifInquiry,
		@AuthMember('_id') receiverId: ObjectId,
	): Promise<Notifies> {
		console.log('Query: getNotifications');

		return await this.notificationService.getNotifications(receiverId, input);
	}

	@UseGuards(WithoutGuard)
	@Mutation((returns) => Notify)
	public async updateNotifications(@Args('input') input: NotifUpdate): Promise<Notify> {
		console.log('Query: getNotifications');
		input._id = shapeIntoMongoObjectId(input._id);

		return await this.notificationService.updateNotifications(input);
	}
}
