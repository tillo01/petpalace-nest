import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { FAQ, FAQs } from '../../libs/dto/faq/faq';
import { FAQInquiry, FAQsInput } from '../../libs/dto/faq/faq.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';

@Injectable()
export class FaqService {
	constructor(@InjectModel('FAQ') private readonly faqQuestionsModel: Model<FAQ>) {}
	public async createFaqQuestions(memberId: ObjectId, input: FAQsInput): Promise<FAQ> {
		input.memberId = memberId;
		try {
			const result = await this.faqQuestionsModel.create(input);
			return result;
		} catch (err) {
			console.log('Error on createfaqQuestions', err);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}
	public async getAllFaqQuestionsByAdmin(input: FAQInquiry): Promise<FAQs> {
		const { noticeStatus, categoryList, noticeType, text } = input.search;
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };
		if (noticeStatus) match.noticeStatus = noticeStatus;
		if (categoryList) match.categoryList = categoryList;
		if (noticeType) match.noticeType = noticeType;
		if (text) match.noticeTitle = { $regex: new RegExp(text, 'i') };
		console.log('match=>>>>', match);

		const result = await this.faqQuestionsModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
						faqmetaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		console.log('result=>>>>>>>', result);
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}
}
