import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Member, Members } from '../../libs/dto/member/member';
import { AgentsInquiry, LoginInput, MemberInput, MembersInquiry } from '../../libs/dto/member/member.input';
import { MemberStatus, MemberType } from '../../libs/enums/member.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { StatisticModifier, T } from '../../libs/types/common';
import ViewService from '../view/view.service';
import { ViewInput } from '../../libs/dto/view/view.input';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { LikeService } from '../like/like.service';
import { Follower, Following, MeFollowed } from '../../libs/dto/follow/follow';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../libs/enums/notification.enum';
import { NotificationService } from '../notification/notification.service';
import { NotifyMeInput } from '../../libs/dto/notifyme/notifyme.input';
import { Notify } from '../../libs/dto/notifyme/notifyme';
import { lookupAuthMemberLiked, lookupMember } from '../../libs/config';

@Injectable()
export class MemberService {
	memberStatus: any;
	constructor(
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		@InjectModel('Follow') private readonly followModel: Model<Follower | Following>,

		private authService: AuthService,
		private viewService: ViewService,
		private likeService: LikeService,
		@Inject(forwardRef(() => NotificationService)) private notificationService: NotificationService,
	) {}
	public async signup(input: MemberInput): Promise<Member> {
		input.memberPassword = await this.authService.hashPassword(input.memberPassword);

		try {
			const result = await this.memberModel.create(input);
			result.accessToken = await this.authService.createToken(result);
			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.USED_MEMBERNICK_OR_PHONE);
		}
	}
	public async login(input: LoginInput): Promise<Member> {
		const { memberNick, memberPassword } = input;
		const response = await this.memberModel
			.findOne({
				memberNick: memberNick,
			})
			.select('+memberPassword')
			.exec();

		if (!response || response.memberStatus === MemberStatus.DELETE) {
			throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
		} else if (response.memberStatus === MemberStatus.BLOCK) {
			throw new InternalServerErrorException(Message.BLOCKED_USER);
		}

		console.log(response);

		const isMatch = await this.authService.comparePasswords(input.memberPassword, response.memberPassword);
		if (!isMatch) throw new InternalServerErrorException(Message.WRONG_PASSWORD);

		response.accessToken = await this.authService.createToken(response);
		return response;
	}
	public async updateMember(memberId: ObjectId, input: MemberUpdate): Promise<Member> {
		const result = await this.memberModel
			.findOneAndUpdate({ _id: memberId, memberStatus: MemberStatus.ACTIVE }, input, { new: true })
			.exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		result.accessToken = await this.authService.createToken(result);
		return result;
	}
	public async getMember(memberId: ObjectId, targetId: ObjectId): Promise<Member> {
		const search: T = { _id: targetId, memberStatus: { $in: [MemberStatus.ACTIVE, MemberStatus.BLOCK] } };
		console.log('1>>>>');

		const targetMember = await this.memberModel.findOne(search).lean().exec();
		console.log('2>>>>');
		if (!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput: ViewInput = { memberId: memberId, viewRefId: targetId, viewGroup: ViewGroup.MEMBER };
			console.log('3>>>>');
			const newView = await this.viewService.recordView(viewInput);
			console.log('4>>>>');
			if (newView) {
				await this.memberModel.findOneAndUpdate(search, { $inc: { memberViews: 1 } }, { new: true }).exec();
				targetMember.memberViews++;
			}
		}

		// me liked
		const LikeInput = {
			memberId: memberId,
			likeRefId: targetId,
			likeGroup: LikeGroup.MEMBER,
		};
		targetMember.meLiked = await this.likeService.checlLikeExistence(LikeInput);
		// mew followed
		targetMember.meFollowed = await this.checkSubscription(memberId, targetId);

		return targetMember;
	}
	private async checkSubscription(followerId: ObjectId, followingId: ObjectId): Promise<MeFollowed[]> {
		const result = await this.followModel.findOne({ followingId: followingId, followerId: followerId }).exec();
		return result ? [{ followerId: followerId, followingId: followingId, myFollowing: true }] : [];
	}

	public async getAgents(memberId: ObjectId, input: AgentsInquiry): Promise<Members> {
		const { text } = input.search;
		const match: T = { memberType: MemberType.AGENT, memberStatus: MemberStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (text) match.memberNick = { $regex: new RegExp(text, 'i') };
		console.log(match);

		const result = await this.memberModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupAuthMemberLiked(memberId),
							lookupMember,
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		console.log(result);
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	public async getAllMembersByAdmin(input: MembersInquiry): Promise<Members> {
		const { memberStatus, memberType, text } = input.search;
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };
		if (memberStatus) match.memberStatus = memberStatus;
		if (memberType) match.memberType = memberType;
		if (text) match.memberNick = { $regex: new RegExp(text, 'i') };
		console.log('match=>>>>>>>>', match);

		const result = await this.memberModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		console.log('result=>>>>>>>', result);
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	public async updateMemberByAdmin(input: MemberUpdate): Promise<Member> {
		const result: Member = await this.memberModel.findByIdAndUpdate({ _id: input._id }, input, { new: true }).exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	public async memberStatsEditor(input: StatisticModifier): Promise<Member> {
		const { _id, targetKey, modifier } = input;

		return await this.memberModel.findOneAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
	}

	public async likeTargetMember(memberId: ObjectId, likeRefId: ObjectId): Promise<Member> {
		const target: Member = await this.memberModel.findOne({ _id: likeRefId, memberStatus: MemberStatus.ACTIVE }).exec();
		if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		const author: Member = await this.memberModel
			.findOne({
				_id: memberId,
				memberStatus: MemberStatus.ACTIVE,
			})
			.exec();
		if (!author) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const input: LikeInput = {
			memberId: memberId,
			likeRefId: likeRefId,
			likeGroup: LikeGroup.MEMBER,
		};

		// LIKE TOGGLE
		const modifier: number = await this.likeService.toggleLike(input);
		console.log('Before createNotification=>>>>>>>>>>');

		if (modifier === 1) {
			const inputNotif: NotifyMeInput = {
				authorId: memberId,
				authorNick: author.memberNick,
				receiverId: likeRefId,
				notificationStatus: NotificationStatus.WAIT,
				notificationDesc: 'New Like',
				notificationGroup: NotificationGroup.MEMBER,
				notificationType: NotificationType.LIKE,
				notificationTitle: 'Got new likes',
				articleId: null,
				propertyId: null,
			};
			await this.notificationService.createNotification(inputNotif);
		}

		const result = await this.memberStatsEditor({
			_id: likeRefId,
			targetKey: 'memberLikes',
			modifier: modifier,
		});
		if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
		return result;
	}
}
