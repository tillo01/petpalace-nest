import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Like, MeLiked } from '../../libs/dto/like/like';
import { LikeInput } from '../../libs/dto/like/like.input';
import { Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';
import { Pets } from '../../libs/dto/pet/pet';
import { LikeGroup } from '../../libs/enums/like.enum';
import { lookupFavorite } from '../../libs/config';
import { OrdinaryInquiry } from '../../libs/dto/pet/pet.input';
import { MemberService } from '../member/member.service';

@Injectable()
export class LikeService {
	constructor(
		@InjectModel('Like') private readonly likeModel: Model<Like>,
		@Inject(forwardRef(() => MemberService)) private memberService: MemberService,
	) {}

	public async toggleLike(input: LikeInput): Promise<number> {
		console.log('Executed likes');
		const search: T = { memberId: input.memberId, likeRefId: input.likeRefId },
			exist = await this.likeModel.findOne(search).exec();
		let modifier = 1;

		if (exist) {
			await this.likeModel.findOneAndDelete(search).exec();
			modifier = -1;
		} else {
			try {
				await this.likeModel.create(input);
			} catch (err) {
				console.log('Error on toggleLike', err.message);
				throw new BadRequestException(Message.CREATE_FAILED);
			}
		}

		console.log(`LikeModifier ${modifier}-`);

		return modifier;
	}

	public async checlLikeExistence(input: LikeInput): Promise<MeLiked[]> {
		const { memberId, likeRefId } = input;
		const result = await this.likeModel.findOne({ memberId: memberId, likeRefId: likeRefId }).exec();

		return result ? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }] : [];
	}

	public async getFavoritePets(memberId: ObjectId, input: OrdinaryInquiry): Promise<Pets> {
		const { page, limit } = input;
		const match: T = { likeGroup: LikeGroup.PROPERTY, memberId: memberId };

		const data: T = await this.likeModel
			.aggregate([
				{
					$match: match,
				},
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'pets',
						localField: 'likeRefId',
						foreignField: '_id',
						as: 'favoritePet',
					},
				},
				{ $unwind: '$favoritePet' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupFavorite,
							{ $unwind: '$favoritePet.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		console.log('data', data);
		const result: Pets = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map((ele) => ele.favoritePet);
		console.log('result', result);

		return result;
	}
}
