import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { FAQ, FAQs } from '../../libs/dto/faq/faq';
import { FAQInquiry, FAQsInput } from '../../libs/dto/faq/faq.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { FAQUpdate } from '../../libs/dto/faq/faq.update';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { NoticeStatus } from '../../libs/enums/notice.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import ViewService from '../view/view.service';
import { MemberType } from '../../libs/enums/member.enum';

@Injectable()
export class FaqService {
	constructor(
		@InjectModel('FAQ') private readonly faqQuestionsModel: Model<FAQ>,
		private readonly viewService: ViewService,
	) {}
	public async createFaqQuestions(memberId: ObjectId, input: FAQsInput): Promise<FAQ> {
		input.memberId =
			memberId; /** Kirib kelayotkan memberId bn biz backenda xosi qilgan memberId ga teklawtirb olyapmiz */
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

	public async updateFaqsQuestionsByAdmin(input: FAQUpdate): Promise<FAQ> {
		const { _id, noticeStatus } = input;
		const result: FAQ = await this.faqQuestionsModel.findByIdAndUpdate({ _id: _id }, input, { new: true });
		console.log('=>>>>>>res', result);

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	public async getAllFaqQuestions(input: FAQInquiry): Promise<FAQs> {
		const { noticeStatus, categoryList, noticeType, text } = input.search;
		const match: T = {
			noticeStatus: noticeStatus ?? NoticeStatus.ACTIVE,
		};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };
		if (categoryList) match.categoryList = categoryList;
		if (noticeType) match.noticeType = noticeType;
		if (text) match.noticeTitle = { $regex: new RegExp(text, 'i') };
		if (input.search?.memberId) {
			match.memberId = shapeIntoMongoObjectId(input.search.memberId);
		}
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

	public async getFaqQuestion(memberId: ObjectId, answerId: ObjectId): Promise<FAQ> {
		const search: T = {
			_id: answerId,
			noticeStatus: NoticeStatus.ACTIVE,
		};
		const targetQuestion: FAQ = await this.faqQuestionsModel.findOne(search).lean().exec();
		if (!targetQuestion) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		if (memberId) {
			const viewInput = {
				memberId: memberId,
				viewRefId: answerId,
				viewGroup: ViewGroup.NOTICE,
			};
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.faqQuestionsStatsEditor({ _id: answerId, targetKey: 'noticeViews', modifier: 1 });
				targetQuestion.noticeViews++;
			}
		}
		return targetQuestion;
	}

	public async removeQuestionsByAdmin(questionId: ObjectId): Promise<FAQ> {
		const search: T = {
			_id: questionId,
			noticeStatus: NoticeStatus.DELETE,
		};
		const result = await this.faqQuestionsModel.findOneAndDelete(search).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
		console.log('Succesfully deleted');
		console.log('Attempting to delete:', questionId, NoticeStatus.DELETE);

		return result;
	}

	public async faqQuestionsStatsEditor(input: StatisticModifier): Promise<FAQ> {
		const { _id, targetKey, modifier } = input;
		return await this.faqQuestionsModel
			.findByIdAndUpdate(
				_id,
				{ $inc: { [targetKey]: modifier } },
				{
					new: true,
				},
			)
			.exec();
	}
}
