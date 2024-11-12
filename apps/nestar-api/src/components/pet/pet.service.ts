import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Schema } from 'mongoose';
import { Direction, Message } from '../../libs/enums/common.enum';
import {
	SellerPetsInquiry,
	AllPetsInquiry,
	OrdinaryInquiry,
	PetsInquiry,
	PetInput,
} from '../../libs/dto/pet/pet.input';
import { MemberService } from '../member/member.service';
import { Pets, Pet } from '../../libs/dto/pet/pet';
import { ViewGroup } from '../../libs/enums/view.enum';
import ViewService from '../view/view.service';
import { StatisticModifier, T } from '../../libs/types/common';

import { PetUpdate } from '../../libs/dto/pet/pet.update';
import * as moment from 'moment';
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { LikeService } from '../like/like.service';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { NotifyMeInput } from '../../libs/dto/notifyme/notifyme.input';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../libs/enums/notification.enum';
import { NotificationService } from '../notification/notification.service';
import { Member } from '../../libs/dto/member/member';
import { MemberStatus } from '../../libs/enums/member.enum';
import { PetStatus } from '../../libs/enums/pet.enum';

@Injectable()
export class PetService {
	findById(commentRefId: Schema.Types.ObjectId) {
		throw new Error('Method not implemented.');
	}
	constructor(
		@InjectModel('Pet') private readonly petModel: Model<Pet>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		@Inject(forwardRef(() => MemberService)) private memberService: MemberService,
		private viewService: ViewService,
		private likeService: LikeService,
		private notificationService: NotificationService,
	) {}

	public async createPet(input: PetInput): Promise<Pet> {
		try {
			const result = await this.petModel.create(input);
			await this.memberService.memberStatsEditor({ _id: result.memberId, targetKey: 'memberPets', modifier: 1 });
			return result;
		} catch (err) {
			console.log('Error on createPet', err);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getPet(memberId: ObjectId, petId: ObjectId): Promise<Pet> {
		const search: T = {
			_id: petId,
			petStatus: PetStatus.ACTIVE,
		};

		const targetPet: Pet = await this.petModel.findOne(search).lean().exec();
		if (!targetPet) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = { memberId: memberId, viewRefId: petId, viewGroup: ViewGroup.PET };
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.petStatsEditor({ _id: petId, targetKey: 'petViews', modifier: 1 });
				targetPet.petViews++;
			}

			lookupAuthMemberLiked(memberId);
			const LikeInput = { memberId: memberId, likeRefId: petId, likeGroup: LikeGroup.MEMBER };
			targetPet.meLiked = await this.likeService.checlLikeExistence(LikeInput);
		}

		targetPet.memberData = await this.memberService.getMember(null, targetPet.memberId);
		return targetPet;
	}

	public async updatePet(memberId: ObjectId, input: PetUpdate): Promise<Pet> {
		let { petStatus, soldAt, deletedAt } = input;
		const search: T = {
			_id: input._id,
			memberId: memberId,
			petStatus: PetStatus.ACTIVE,
		};

		if (petStatus === PetStatus.SOLD) soldAt = moment().toDate();
		else if (petStatus === PetStatus.DELETE) deletedAt = moment().toDate();

		const result = await this.petModel
			.findOneAndUpdate(search, input, {
				new: true,
			})
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (soldAt || deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberPets',
				modifier: -1,
			});
		}

		return result;
	}

	public async getPets(memberId: ObjectId, input: PetsInquiry): Promise<Pets> {
		const match: T = { petStatus: PetStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		this.shapeMatchQuery(match, input);
		console.log('match', match);

		const result = await this.petModel
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
							{ $unwind: '$memberData' }, // [memberData] => memberData
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	private shapeMatchQuery(match: T, input: PetsInquiry): void {
		const {
			memberId,
			locationList,
			heightsList,
			agesList,
			typeList,
			periodsRange,
			pricesRange,
			weightRange,
			options,
			text,
		} = input.search;

		if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);
		if (locationList && locationList.length) match.petLocation = { $in: locationList };
		if (heightsList && heightsList.length) match.petAges = { $in: heightsList };
		if (agesList && agesList.length) match.petHeight = { $in: agesList };
		if (typeList && typeList.length) match.petType = { $in: typeList };

		if (pricesRange) match.petPrice = { $gte: pricesRange.start, $lte: pricesRange.end };
		if (periodsRange) match.createdAt = { $gte: weightRange.start, $lte: weightRange.end };
		if (weightRange) match.petWeight = { $gte: weightRange.start, $lte: weightRange.end };

		if (text) match.petTitle = { $regex: new RegExp(text, 'i') };
		if (options && options.length) {
			match['$or'] = options.map((ele) => {
				return { [ele]: true };
			});
		}
	}

	public async getFavorites(memberId: ObjectId, input: OrdinaryInquiry): Promise<Pets> {
		return await this.likeService.getFavoritePets(memberId, input);
	}

	public async getVisited(memberId: ObjectId, input: OrdinaryInquiry): Promise<Pets> {
		return await this.viewService.getVisitedPets(memberId, input);
	}

	public async getSellerPets(memberId: ObjectId, input: SellerPetsInquiry): Promise<Pets> {
		const { petStatus } = input.search;
		if (petStatus === PetStatus.DELETE) throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);

		const match: T = {
			memberId: memberId,
			petStatus: petStatus ?? { $ne: PetStatus.DELETE },
		};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.petModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
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
	public async getAllPetsByAdmin(input: AllPetsInquiry): Promise<Pets> {
		const { petStatus, petLocationList } = input.search;
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (petStatus) match.petStatus = petStatus;
		if (petLocationList) match.petLocation = { $in: petLocationList };

		const result = await this.petModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							{ $lookup: { from: 'members', localField: 'memberId', foreignField: '_id', as: 'memberData' } },
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

	public async updatePetByAdmin(input: PetUpdate): Promise<Pet> {
		const { _id, petStatus } = input;

		if (petStatus === PetStatus.SOLD) {
			input.soldAt = moment().toDate();
		} else if (petStatus === PetStatus.DELETE) {
			input.deletedAt = moment().toDate();
		}

		const searchCriteria = {
			_id: _id,
			petStatus: PetStatus.ACTIVE,
		};

		const result = await this.petModel.findOneAndUpdate(searchCriteria, input, { new: true });

		if (!result) {
			throw new InternalServerErrorException(Message.UPDATE_FAILED);
		}

		if (petStatus === PetStatus.SOLD || petStatus === PetStatus.DELETE) {
			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberPets',
				modifier: -1,
			});
		}

		return result;
	}

	public async removePetByAdmin(petId: ObjectId): Promise<Pet> {
		const searchCriteria = {
			_id: petId,
			petStatus: PetStatus.DELETE,
		};
		const result = await this.petModel.findOneAndDelete(searchCriteria).exec();

		if (!result) {
			throw new InternalServerErrorException(Message.REMOVE_FAILED);
		}

		return result;
	}

	public async petStatsEditor(input: StatisticModifier): Promise<Pet> {
		const { _id, targetKey, modifier } = input;
		return await this.petModel.findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
	}

	public async likeTargetPet(memberId: ObjectId, likeRefId: ObjectId): Promise<Pet> {
		const target: Pet = await this.petModel.findOne({ _id: likeRefId, petStatus: PetStatus.ACTIVE }).exec();
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
			likeGroup: LikeGroup.PET,
		};
		// LIKE TOGGLE
		const modifier: number = await this.likeService.toggleLike(input);

		if (modifier === 1) {
			const inputNotif: NotifyMeInput = {
				authorId: memberId,
				receiverId: target.memberId,
				authorNick: author.memberNick,
				notificationStatus: NotificationStatus.WAIT,
				notificationDesc: 'New Like to your pet',
				notificationGroup: NotificationGroup.PET,
				notificationType: NotificationType.LIKE,
				notificationTitle: 'New Like to your pet',
				articleId: null,
				petId: likeRefId,
				petTitle: target.petTitle,
			};
			await this.notificationService.createNotification(inputNotif);
		}

		const result = await this.petStatsEditor({ _id: likeRefId, targetKey: 'petLikes', modifier: modifier });
		if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
		return result;
	}
}
