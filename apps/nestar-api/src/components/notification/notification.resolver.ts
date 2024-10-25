import { Args, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Notify } from '../../libs/dto/notifyme/notifyme';
import { NotifInquiry } from '../../libs/dto/notifyme/notifyme.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';

@Resolver()
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Query((returns) => Notify)
	public async getNotifications(
		@Args('input') input: NotifInquiry,
		@AuthMember('_id') receiverId: ObjectId,
	): Promise<Notify[]> {
		console.log('Query: getNotifications');

		return await this.notificationService.getNotifications(receiverId, input);
	}
}
