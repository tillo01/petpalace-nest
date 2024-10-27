import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { NoticeCategory, NoticeStatus, NoticeType } from '../../enums/notice.enum';
import { ObjectId } from 'mongoose';
import { Direction } from '../../enums/common.enum';
import { availableFAQs } from '../../config';

@InputType()
export class FAQsInput {
	@IsNotEmpty()
	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@IsNotEmpty()
	@Field(() => NoticeStatus)
	noticeStatus: NoticeStatus;

	@IsNotEmpty()
	@Field(() => NoticeType)
	noticeType: NoticeType;

	@IsOptional()
	@IsInt()
	@Field(() => Number, { nullable: true })
	noticeViews?: number;

	@IsNotEmpty()
	@Field(() => String)
	noticeTitle: string;

	@IsNotEmpty()
	@Field(() => String)
	noticeContent: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	createdAt?: Date;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	deletedAt: Date;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	updatedAt: Date;
}

@InputType()
class FAQSearch {
	@IsOptional()
	@Field(() => NoticeCategory, { nullable: true })
	categoryList?: NoticeCategory;

	@IsOptional()
	@Field(() => NoticeType, { nullable: true })
	noticeType?: NoticeType;

	@IsOptional()
	@Field(() => NoticeStatus, { nullable: true })
	noticeStatus?: NoticeStatus;

	@IsOptional()
	@Field(() => [Int], { nullable: true })
	perPageList?: Number[];

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class FAQInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableFAQs)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => FAQSearch)
	search: FAQSearch;
}

@InputType()
export class FaqOrdinaryInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;
}
