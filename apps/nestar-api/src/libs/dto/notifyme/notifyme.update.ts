import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { NotificationStatus } from '../../enums/notification.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class NotifUpdate {
	@IsOptional()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => NotificationStatus)
	notificationStatus: NotificationStatus;
}
