import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pet } from '../../nestar-api/src/libs/dto/pet/pet';
import { Member } from '../../nestar-api/src/libs/dto/member/member';
import { MemberStatus, MemberType } from '../../nestar-api/src/libs/enums/member.enum';
import { PetStatus } from '../../nestar-api/src/libs/enums/pet.enum';

@Injectable()
export class BatchService {
	constructor(
		@InjectModel('Pet') private readonly petModel: Model<Pet>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
	) {}

	public async batchRollback(): Promise<void> {
		await this.petModel
			.updateMany(
				{
					petStatus: PetStatus.ACTIVE,
				},
				{ petRank: 0 },
			)
			.exec();

		await this.memberModel
			.updateMany(
				{
					memberStatus: MemberStatus.ACTIVE,
					memberType: MemberType.SELLER,
				},
				{ memberRank: 0 },
			)
			.exec();
	}

	public async batchTopPets(): Promise<void> {
		const pets: Pet[] = await this.petModel
			.find({
				petStatus: PetStatus.ACTIVE,
				petRank: 0,
			})
			.exec();

		const promisedList = pets.map(async (ele: Pet) => {
			const { _id, petLikes, petViews } = ele;
			const rank = petLikes * 2 + petViews * 1;
			return await this.petModel.findByIdAndUpdate(_id, { petRank: rank });
		});
		await Promise.all(promisedList);
	}

	public async batchTopSellers(): Promise<void> {
		const sellers: Member[] = await this.memberModel
			.find({
				memberType: MemberType.SELLER,
				memberStatus: MemberStatus.ACTIVE,
				memberRank: 0,
			})
			.exec();

		const promisedList = sellers.map(async (ele: Member) => {
			const { _id, memberPets, memberLikes, memberArticles, memberViews } = ele;
			const rank = memberPets * 5 + memberArticles * 3 + memberLikes * 2 + memberViews * 1;
			return await this.memberModel.findByIdAndUpdate(_id, { memberRank: rank });
		});
		await Promise.all(promisedList);
	}

	public getHello(): string {
		return 'Welcome to Nestar BATCH Server!';
	}
}
