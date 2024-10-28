import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	PROPERTY = 'PROPERTY',
	NOTICE = 'NOTICE',
}
registerEnumType(ViewGroup, {
	name: 'ViewGroup',
});
