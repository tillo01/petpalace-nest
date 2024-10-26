import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Notifies, Notify } from '../../libs/dto/notifyme/notifyme';
import { NotifInquiry, NotifyMeInput } from '../../libs/dto/notifyme/notifyme.input';
import { MemberService } from '../member/member.service';
import { Direction, Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';
import { lookupAuthMemberLiked, lookupMember } from '../../libs/config';
import { NotificationStatus } from '../../libs/enums/notification.enum';
import { NotifUpdate } from '../../libs/dto/notifyme/notifyme.update';

@Injectable()
export class NotificationService {
	constructor(
		@InjectModel('Notify') private notificationModel: Model<Notify>,
		@Inject(forwardRef(() => MemberService)) private memberService: MemberService,
	) {}

	public async createNotification(input: NotifyMeInput): Promise<Notify> {
		console.log('Executed createNotification');
		try {
			const result = await this.notificationModel.create(input);
			console.log('++++++', input.receiverId);
			console.log('++++++', result);
			return result;
		} catch (err) {
			console.log('Error on createNotif', err);
			throw new BadRequestException(Message.NOT_GET_NOTIFY);
		}
	}

	public async getNotifications(receiverId: ObjectId, input: NotifInquiry): Promise<Notifies> {
		const match: T = {
			receiverId: receiverId,
		};
		console.log('-----------,', receiverId);

		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const data = await this.notificationModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$lookup: {
						from: 'members',
						localField: 'authorId',
						foreignField: '_id',
						as: 'memberData',
					},
				},

				{
					$unwind: '$memberData',
				},
				{
					$lookup: {
						from: 'properties',
						localField: 'propertyId',
						foreignField: '_id',
						as: 'propertyData',
					},
				},
				{ $unwind: { path: '$propertyData', preserveNullAndEmptyArrays: true } },
				{
					$lookup: {
						from: 'boardArticles',
						localField: 'articleId',
						foreignField: '_id',
						as: 'articleData',
					},
				},
				{ $unwind: { path: '$articleData', preserveNullAndEmptyArrays: true } },

				{
					$facet: {
						list: [{ $limit: input.limit }],
					},
				},
			])
			.exec();

		const result: Notifies = { list: [] };
		result.list = data[0].list.map((ele) => ({
			...ele,
			authorNick: ele.memberData.memberNick,
			propertyTitle: ele.propertyTitle,
			artticleTitle: ele.articleTitle,
		}));

		return result;
	}

	public async updateNotifications(input: NotifUpdate): Promise<Notify> {
		const { _id, notificationStatus } = input;
		const result = await this.notificationModel.findOneAndUpdate(
			{ _id },
			{ notificationStatus: notificationStatus || NotificationStatus.WAIT },
			{ new: true },
		);
		if (!result) {
			throw new InternalServerErrorException(Message.UPDATE_FAILED);
		}
		console.log('resultt', result);

		return result;
	}
}
