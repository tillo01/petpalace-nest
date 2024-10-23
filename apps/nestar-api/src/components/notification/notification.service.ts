import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notify } from '../../libs/dto/notifyme/notifyme';
import { NotifyMeInput } from '../../libs/dto/notifyme/notifyme.input';
import { MemberService } from '../member/member.service';
import { Message } from '../../libs/enums/common.enum';
import { Member } from '../../libs/dto/member/member';
import { StatisticModifier } from '../../libs/types/common';

@Injectable()
export class NotificationService {
	constructor(
		@InjectModel('Notify') private readonly notificationModel: Model<Notify>,
		@Inject(forwardRef(() => MemberService)) private memberService: MemberService,
	) {}

	public async createNotification(input: NotifyMeInput): Promise<Notify> {
		console.log('Executed createNotification');
		try {
			const result = await this.notificationModel.create(input);
			await this.memberService.memberStatsEditor({ _id: result.receiverId, targetKey: 'memberWarnings', modifier: +1 });

			return result;
		} catch (err) {
			console.log('Error on createNotif');
			throw new BadRequestException(Message.NOT_GET_NOTIFY);
		}
	}
}
