import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';
import { PetLocation, PetStatus, PetType } from '../../enums/pet.enum';

@ObjectType()
export class Pet {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => PetType)
	petType: PetType;

	@Field(() => PetStatus)
	petStatus: PetStatus;

	@Field(() => PetLocation)
	petLocation: PetLocation;

	@Field(() => String)
	petAddress: string;

	@Field(() => String)
	petTitle: string;

	@Field(() => Number)
	petPrice: number;

	@Field(() => Number)
	petWeight: number;

	@Field(() => Int)
	petHeight: number;

	@Field(() => Int)
	petAges: number;

	@Field(() => Int)
	petViews: number;

	@Field(() => Int)
	petLikes: number;

	@Field(() => String)
	petComments: number;

	@Field(() => Int)
	petRank: number;

	@Field(() => [String])
	petImages: string;

	@Field(() => String, { nullable: true })
	petDesc?: string;

	@Field(() => Boolean)
	petSell: boolean;

	@Field(() => Boolean)
	petAdoption: boolean;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date, { nullable: true })
	soldAt?: Date;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date, { nullable: true })
	bornAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation*/

	@Field(() => Member, { nullable: true })
	memberData?: Member;

	@Field(() => [MeLiked], { nullable: true })
	meLiked?: MeLiked[];
}

@ObjectType()
export class Pets {
	@Field(() => [Pet])
	list: Pet[];

	@Field(() => [TotalCounter])
	metaCounter: TotalCounter[];
}
