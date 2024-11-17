import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FaqService } from './faq.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FAQ, FAQs } from '../../libs/dto/faq/faq';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { FAQInquiry, FAQsInput } from '../../libs/dto/faq/faq.input';
import { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { FAQUpdate } from '../../libs/dto/faq/faq.update';
import { WithoutGuard } from '../auth/guards/without.guard';

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

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query((returns) => FAQs)
	public async getAllFaqQuestionsByAdmin(@Args('input') input: FAQInquiry): Promise<FAQs> {
		console.log('Query getAllFaqQuestionsByAdmin');
		return await this.faqService.getAllFaqQuestionsByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => FAQ)
	public async updateFaqsQuestionsByAdmin(@Args('input') input: FAQUpdate): Promise<FAQ> {
		console.log('Mutations createFaqQuestions');

		return await this.faqService.updateFaqsQuestionsByAdmin(input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => FAQs)
	public async getAllFaqQuestions(
		@Args('input') input: FAQInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<FAQs> {
		console.log('Query getAllFaqQuestionsByAdmin');
		return await this.faqService.getAllFaqQuestions(input);
	}

	@UseGuards(WithoutGuard)
	@Mutation((returns) => FAQ)
	public async getFaqQuestion(@Args('answerId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<FAQ> {
		console.log('Query getFaqQuestion');
		const answerId = shapeIntoMongoObjectId(input);
		return await this.faqService.getFaqQuestion(memberId, answerId);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => FAQ)
	public async removeQuestionsByAdmin(
		@Args('questionId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<FAQ> {
		console.log('Mutations removeQuestionsByAdmin');
		const questionId = shapeIntoMongoObjectId(input);
		return await this.faqService.removeQuestionsByAdmin(questionId);
	}
}
