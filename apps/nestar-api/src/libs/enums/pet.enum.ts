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
	TOKYO = 'TOKYO',
	OSAKA = 'OSAKA',
	KYOTO = 'KYOTO',
	KOBE = 'KOBE',
	NAGOYA = 'NAGOYA',
	NARA = 'NARA',
	FUKUOKA = 'FUKUOKA',
	HIROSHIMA = 'HIROSHIMA',
	YOKOHAMA = 'YOKOHAMA',
}
registerEnumType(PetLocation, {
	name: 'PetLocation',
});
