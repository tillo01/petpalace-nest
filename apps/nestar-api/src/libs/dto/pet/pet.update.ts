import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { PetLocation, PetStatus, PetType } from '../../enums/pet.enum';

@InputType()
export class PetUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => PetType, { nullable: true })
	petType?: PetType;

	@IsOptional()
	@Field(() => PetStatus, { nullable: true })
	petStatus?: PetStatus;

	@IsOptional()
	@Field(() => PetLocation, { nullable: true })
	petLocation?: PetLocation;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	petAddress?: string;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	petTitle?: string;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	petPrice?: number;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	petWeight?: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Field(() => Int, { nullable: true })
	petHeight?: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Field(() => Int, { nullable: true })
	petAges?: number;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	petImages?: string[];

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	petDesc?: string;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	petSell?: boolean;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	petAdoption?: boolean;

	soldAt?: Date;

	deletedAt?: Date;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	bornAt?: Date;
}
