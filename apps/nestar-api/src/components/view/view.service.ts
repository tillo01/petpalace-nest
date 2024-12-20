import { InjectModel } from '@nestjs/mongoose';
import { View } from '../../libs/dto/view/view';
import { Model, ObjectId } from 'mongoose';
import { ViewInput } from '../../libs/dto/view/view.input';
import { T } from '../../libs/types/common';
import { Injectable } from '@nestjs/common';
import { lookupFavorite, lookupVisit } from '../../libs/config';
import { ViewGroup } from '../../libs/enums/view.enum';
import { OrdinaryInquiry } from '../../libs/dto/pet/pet.input';
import { Pets } from '../../libs/dto/pet/pet';

@Injectable()
export default class ViewService {
	likeModel: any;
	constructor(@InjectModel('View') private readonly viewModel: Model<View>) {}

	public async recordView(input: ViewInput): Promise<View | null> {
		console.log('recordView executed!');
		const viewExist = await this.checkViewExistance(input);
		console.log('5>>>>>>');

		if (!viewExist) {
			console.log('New View Insert -');
			return await this.viewModel.create(input);
		} else {
			return null;
		}
	}

	private async checkViewExistance(input: ViewInput): Promise<View> {
		const { memberId, viewRefId } = input;
		const search: T = { memberId: memberId, viewRefId: viewRefId };
		return await this.viewModel.findOne(search).exec();
	}

	public async getVisitedPets(memberId: ObjectId, input: OrdinaryInquiry): Promise<Pets> {
		const { page, limit } = input;
		const match: T = { viewGroup: ViewGroup.PET, memberId: memberId };

		const data: T = await this.viewModel
			.aggregate([
				{
					$match: match,
				},
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'pets',
						localField: 'viewRefId',
						foreignField: '_id',
						as: 'visitedPet',
					},
				},
				{ $unwind: '$visitedPet' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupVisit,
							{ $unwind: '$visitedPet.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		console.log('data', data);
		const result: Pets = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map((ele) => ele.visitedPet);
		console.log('result', result);

		return result;
	}
}
