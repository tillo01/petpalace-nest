import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';

@ObjectType()
export class MeNofied {
	@Field(() => String)
	authorId: ObjectId;

	@Field(() => String)
	receiverId: ObjectId;

	@Field(() => String)
	propertyId: ObjectId;

	@Field(() => String)
	articleId: ObjectId;
}

@ObjectType()
export class Notify {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	authorId: ObjectId;

	@Field(() => String)
	receiverId: ObjectId;

	@Field(() => String)
	propertyId: ObjectId;

	@Field(() => String)
	articleId: ObjectId;

	@Field(() => NotificationType)
	notificationType: NotificationType;

	@Field(() => NotificationStatus)
	notificationStatus: NotificationStatus;

	@Field(() => NotificationGroup)
	notificationGroup: NotificationGroup;
}
