import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';

@ObjectType()
export class Notify {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	authorId: ObjectId;

	@Field(() => String)
	receiverId: ObjectId;

	@Field(() => String, { nullable: true })
	propertyId?: ObjectId;

	@Field(() => String, { nullable: true })
	articleId?: ObjectId;

	@Field(() => String, { nullable: true })
	authorNick?: string;

	@Field(() => String, { nullable: true })
	propertyTitle?: string;

	@Field(() => NotificationType)
	notificationType: NotificationType;

	@Field(() => NotificationStatus)
	notificationStatus: NotificationStatus;

	@Field(() => NotificationGroup)
	notificationGroup: NotificationGroup;

	@Field(() => String)
	notificationTitle: string;

	@Field(() => String, { nullable: true })
	notificationDesc: string;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}

@ObjectType()
export class Notifies {
	@Field(() => [Notify], { nullable: false })
	list: Notify[];
}
