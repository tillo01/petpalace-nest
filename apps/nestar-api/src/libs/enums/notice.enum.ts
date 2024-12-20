import { registerEnumType } from '@nestjs/graphql';

export enum NoticeCategory {
	FAQ = 'FAQ',
	NOTICE = 'NOTICE',
	INQUIRY = 'INQUIRY',
}
registerEnumType(NoticeCategory, {
	name: 'NoticeCategory',
});

export enum NoticeStatus {
	HOLD = 'HOLD',
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}
registerEnumType(NoticeStatus, {
	name: 'NoticeStatus',
});

export enum NoticeType {
	PET = 'PET',
	PAYMENT = 'PAYMENT',
	FORBUYERS = 'FORBUYERS',
	FORSELLERS = 'FORSELLERS',
	COMMUNITY = 'COMMUNITY',
	OTHER = 'OTHER',
}
registerEnumType(NoticeType, {
	name: 'NoticeType',
});
