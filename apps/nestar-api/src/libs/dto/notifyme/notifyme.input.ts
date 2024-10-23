import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ObjectId } from 'mongoose';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';

@InputType()
export class NotifyMeInput {
	@IsNotEmpty()
	@Field(() => String)
	authorId: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	receiverId: ObjectId;

	@IsNotEmpty()
	@Field(() => NotificationType)
	notificationType: NotificationType;

	@IsNotEmpty()
	@Field(() => NotificationStatus)
	notificationStatus: NotificationStatus;

	@IsNotEmpty()
	@Field(() => NotificationGroup)
	notificationGroup: NotificationGroup;

	@IsNotEmpty()
	@Field(() => String, { nullable: true })
	notificationTitle: String;

	@IsOptional()
	@Length(1, 30)
	@Field(() => String, { nullable: true })
	notificationDesc: String;
}

// @IsNotEmpty()
// @Field(() => String)
// propertyId: ObjectId;

// @IsNotEmpty()
// @Field(() => String)
// articleId: ObjectId;
