import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { NoticeCategory, NoticeStatus, NoticeType } from '../../enums/notice.enum';

@ObjectType()
export class FAQ {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@Field(() => NoticeStatus)
	noticeStatus: NoticeStatus;

	@Field(() => NoticeType)
	noticeType: NoticeType;

	@Field(() => String, { nullable: true })
	noticeViews?: string;

	@Field(() => String)
	noticeTitle: string;

	@Field(() => String)
	noticeContent: string;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date, { nullable: true })
	createdAt?: Date;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date, { nullable: true })
	updatedAt?: Date;
}

@ObjectType()
export class FAQs {
	@Field(() => [FAQ])
	liest: FAQ[];

	@Field(() => [FAQTotalCounter])
	metaCounter: FAQTotalCounter[];
}

@ObjectType()
export class FAQTotalCounter {
	@Field(() => Int, { nullable: true })
	total: number;
}
