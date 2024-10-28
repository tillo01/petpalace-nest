import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { NoticeCategory, NoticeStatus, NoticeType } from '../../enums/notice.enum';

@ObjectType()
export class FAQ {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@Field(() => NoticeStatus, { nullable: true })
	noticeStatus?: NoticeStatus;

	@Field(() => NoticeType, { nullable: true })
	noticeType?: NoticeType;

	@Field(() => String)
	noticeTitle: string;

	@Field(() => Int)
	noticeViews: number;

	@Field(() => String)
	noticeContent: string;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date)
	updatedAt?: Date;
}

@ObjectType()
export class FAQs {
	@Field(() => [FAQ])
	list: FAQ[];

	@Field(() => [FAQTotalCounter])
	faqmetaCounter: FAQTotalCounter[];
}

@ObjectType()
export class FAQTotalCounter {
	@Field(() => Int, { nullable: true })
	total: number;
}
