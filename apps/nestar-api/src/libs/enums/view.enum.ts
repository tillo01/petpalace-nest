import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	PET = 'PET',
	NOTICE = 'NOTICE',
}
registerEnumType(ViewGroup, {
	name: 'ViewGroup',
});
