import { Schema } from 'mongoose';
import { NotificationGroup, NotificationStatus, NotificationType } from '../libs/enums/notification.enum';

const NotificationSchema = new Schema(
	{
		notificationType: {
			type: String,
			enum: NotificationType,
			required: true,
		},

		notificationStatus: {
			type: String,
			enum: NotificationStatus,
			default: NotificationStatus.WAIT,
		},

		notificationGroup: {
			type: String,
			enum: NotificationGroup,
			required: true,
		},

		notificationTitle: {
			type: String,
			required: true,
		},

		notificationDesc: {
			type: String,
		},

		authorNick: {
			type: String,
		},
		petTitle: {
			type: String,
		},
		articleTitle: {
			type: String,
		},
		commentContent: {
			type: String,
		},

		authorId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		commentRefId: {
			type: Schema.Types.ObjectId,
			ref: 'Comment',
		},

		receiverId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		petId: {
			type: Schema.Types.ObjectId,
			ref: 'Pet',
		},

		articleId: {
			type: Schema.Types.ObjectId,
			ref: 'BoardArticle',
		},
	},
	{ timestamps: true, collection: 'notifications' },
);

export default NotificationSchema;
