import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FaqService } from './faq.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FAQ } from '../../libs/dto/faq/faq';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { FAQsInput } from '../../libs/dto/faq/faq.input';
import { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class FaqResolver {
	constructor(private readonly faqService: FaqService) {}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => FAQ)
	public async createFaqQuestions(
		@Args('input') input: FAQsInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<FAQ> {
		console.log('Mutations createFaqQuestions');

		return await this.faqService.createFaqQuestions(memberId, input);
	}
}
