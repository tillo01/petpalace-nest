import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MemberService } from '../member/member.service';
import { PropertyService } from '../property/property.service';
import { BoardArticleService } from '../board-article/board-article.service';
import { CommentInput, CommentsInquiry } from '../../libs/dto/comment/comment.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { Model, ObjectId } from 'mongoose';
import { Comment, Comments } from '../../libs/dto/comment/comment';
import { CommentUpdate } from '../../libs/dto/comment/comment.update';
import { T } from '../../libs/types/common';
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../libs/enums/notification.enum';
import { Property } from '../../libs/dto/property/property';
import { BoardArticle } from '../../libs/dto/board-article/board-article';
import { Member } from '../../libs/dto/member/member';
import { NotifyMeInput } from '../../libs/dto/notifyme/notifyme.input';
import { PropertyStatus } from '../../libs/enums/property.enum';
import { NotificationService } from '../notification/notification.service';
import { MemberStatus } from '../../libs/enums/member.enum';
import { BoardArticleStatus } from '../../libs/enums/board-article.enum';

@Injectable()
export class CommentService {
	constructor(
		@InjectModel('Comment') private readonly commentModel: Model<Comment>,
		@InjectModel('Property') private readonly propertyModel: Model<Property>,
		@InjectModel('Property') private readonly memberModel: Model<Member>,

		@InjectModel('BoardArticle') private readonly boardArticleModel: Model<BoardArticle>,

		private readonly memberService: MemberService,
		private readonly propertyService: PropertyService,
		private readonly boardArticleService: BoardArticleService,
		private readonly notificationService: NotificationService,
	) {}
	public async createComment(memberId: ObjectId, input: CommentInput): Promise<Comment> {
		// input.commentRefId = shapeIntoMongoObjectId(input.commentRefId);
		input.memberId = memberId;
		let result = null;

		const inputNotif: NotifyMeInput = {
			authorId: memberId,
			receiverId: null,
			notificationStatus: NotificationStatus.WAIT,
			notificationDesc: '',
			notificationGroup: NotificationGroup.PROPERTY,
			commentContent: input.commentContent,
			notificationType: NotificationType.COMMENT,
			propertyId: null,
			propertyTitle: '',
		};

		try {
			result = await this.commentModel.create(input);
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
		switch (input.commentGroup) {
			case CommentGroup.PROPERTY:
				await this.propertyService.propertyStatsEditor({
					_id: input.commentRefId,
					targetKey: 'propertyComments',
					modifier: 1,
				});

				const getAgentProperty = await this.propertyService.getProperty(memberId, input.commentRefId);
				const propertyNotif = {
					...inputNotif,
					receiverId: getAgentProperty.memberId,
					notificationGroup: NotificationGroup.PROPERTY,
					notificationTitle: 'Commented on your property',
					propertyId: input.commentRefId,
					propertyTitle: getAgentProperty.propertyTitle,
				};

				await this.notificationService.createNotification(propertyNotif);

				break;
			case CommentGroup.ARTICLE:
				await this.boardArticleService.boardArticleStatsEditor({
					_id: input.commentRefId,
					targetKey: 'articleComments',
					modifier: 1,
				});

				const getBoardArticle = await this.boardArticleService.getBoardArticle(memberId, input.commentRefId);

				const articleInput = {
					...inputNotif,
					receiverId: getBoardArticle.memberId,
					notificationGroup: NotificationGroup.ARTICLE,
					notificationTitle: 'Commented on your article',
					articleId: getBoardArticle._id,
					articleTitle: getBoardArticle.articleTitle,
				};

				await this.notificationService.createNotification(articleInput);
				break;

			case CommentGroup.MEMBER:
				await this.memberService.memberStatsEditor({
					_id: input.commentRefId,
					targetKey: 'memberComments',
					modifier: 1,
				});

				const memberInputNotif = {
					...inputNotif,
					receiverId: input.commentRefId,
					notificationGroup: NotificationGroup.MEMBER,
					notificationTitle: 'Commented on your profile',
				};

				await this.notificationService.createNotification(memberInputNotif);
				break;
		}

		if (!result) throw new InternalServerErrorException(Message.CREATE_FAILED);
		return result;
	}

	public async updateComment(memberId: ObjectId, input: CommentUpdate): Promise<Comment> {
		const { _id } = input;
		const result = await this.commentModel
			.findOneAndUpdate(
				{
					_id: _id,
					memberId: memberId,
					commentStatus: CommentStatus.ACTIVE,
				},
				input,
				{
					new: true,
				},
			)
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		return result;
	}

	public async getComments(memberId: ObjectId, input: CommentsInquiry): Promise<Comments> {
		const { commentRefId } = input.search;

		const match: T = { commentRefId: commentRefId, commentStatus: CommentStatus.ACTIVE };

		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };
		const result: Comments[] = await this.commentModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							// lookupAuthMemberLiked(memberId),
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	public async removeCommentByAdmin(input: ObjectId): Promise<Comment> {
		const result = await this.commentModel.findByIdAndDelete(input);
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
		return result;
	}
}
