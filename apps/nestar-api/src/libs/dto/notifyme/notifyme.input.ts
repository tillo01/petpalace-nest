import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { Direction } from '../../enums/common.enum';
import { availableNotifSorts } from '../../config';

@InputType()
export class NotifyMeInput {
	@IsNotEmpty()
	@Field(() => String)
	authorId: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	receiverId: ObjectId;

	@IsNotEmpty()
	@Field(() => String, { nullable: true })
	propertyId: ObjectId;

	@IsNotEmpty()
	@Field(() => String, { nullable: true })
	articleId: ObjectId;

	@IsNotEmpty()
	@Field(() => String, { nullable: true })
	authorNick?: string;

	@IsNotEmpty()
	@Field(() => String, { nullable: true })
	propertyTitle?: string;

	@IsNotEmpty()
	@Field(() => NotificationType)
	notificationType: NotificationType;

	@IsNotEmpty()
	@Field(() => NotificationGroup)
	notificationGroup: NotificationGroup;

	@IsOptional()
	@Length(1, 30)
	@Field(() => String)
	notificationDesc: String;

	@IsOptional()
	@Length(1, 30)
	@Field(() => String)
	notificationTitle: String;

	@IsNotEmpty()
	@Field(() => NotificationStatus)
	notificationStatus: NotificationStatus;
}

@InputType()
export class NFSearch {
	@IsOptional()
	@Field(() => NotificationStatus, { nullable: true })
	notificationStatus: NotificationStatus;
}
@InputType()
export class NotifInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableNotifSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction)
	direction?: Direction;
}
