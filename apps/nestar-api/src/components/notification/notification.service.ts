import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Notify } from '../../libs/dto/notifyme/notifyme';
import { NotifInquiry, NotifyMeInput } from '../../libs/dto/notifyme/notifyme.input';
import { MemberService } from '../member/member.service';
import { Direction, Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';
import { lookupAuthMemberLiked, lookupMember } from '../../libs/config';
import { NotificationStatus } from '../../libs/enums/notification.enum';

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

	public async getNotifications(receiverId: ObjectId, input: NotifInquiry): Promise<Notify[]> {
		const match: T = {
			receiverId: receiverId,
		};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.notificationModel.aggregate([{ $match: match }, { $sort: sort }]).exec();
		console.log('result=>>>', result);

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}
}
