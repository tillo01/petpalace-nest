import { registerEnumType } from '@nestjs/graphql';

export enum PetType {
	DOG = 'DOG',
	CAT = 'CAT',
}
registerEnumType(PetType, {
	name: 'PetType',
});

export enum PetStatus {
	ACTIVE = 'ACTIVE',
	SOLD = 'SOLD',
	DELETE = 'DELETE',
}
registerEnumType(PetStatus, {
	name: 'PetStatus',
});

export enum PetLocation {
	SEOUL = 'SEOUL',
	BUSAN = 'BUSAN',
	INCHEON = 'INCHEON',
	DAEGU = 'DAEGU',
	GYEONGJU = 'GYEONGJU',
	GWANGJU = 'GWANGJU',
	CHONJU = 'CHONJU',
	DAEJON = 'DAEJON',
	JEJU = 'JEJU',
}
registerEnumType(PetLocation, {
	name: 'PetLocation',
});
