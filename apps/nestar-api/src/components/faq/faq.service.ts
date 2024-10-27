import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { FAQ } from '../../libs/dto/faq/faq';
import { FAQsInput } from '../../libs/dto/faq/faq.input';
import { Message } from '../../libs/enums/common.enum';

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
}
