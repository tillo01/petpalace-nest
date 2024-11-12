import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { availableOptions, availablePetSorts } from '../../config';
import { Direction } from '../../enums/common.enum';
import { PetLocation, PetStatus, PetType } from '../../enums/pet.enum';

@InputType()
export class PetInput {
	@IsNotEmpty()
	@Field(() => PetType)
	petType: PetType;

	@IsNotEmpty()
	@Field(() => PetLocation)
	petLocation: PetLocation;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	petAddress: string;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	petTitle: string;

	@IsNotEmpty()
	@Field(() => Number)
	petPrice: number;

	@IsNotEmpty()
	@Field(() => Number)
	petWeight: number;

	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Field(() => Int)
	petHeight: number;

	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Field(() => Int)
	petAges: number;

	@IsNotEmpty()
	@Field(() => [String])
	petImages: string[];

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

	memberId?: ObjectId;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	bornAt?: Date;
}

@InputType()
export class PricesRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
export class WeightsRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
export class PeriodsRange {
	@Field(() => Date)
	start: Date;

	@Field(() => Date)
	end: Date;
}

@InputType()
class PISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@IsOptional()
	@Field(() => [PetLocation], { nullable: true })
	locationList?: PetLocation[];

	@IsOptional()
	@Field(() => [PetType], { nullable: true })
	typeList?: PetType[];

	@IsOptional()
	@Field(() => [Int], { nullable: true })
	heightsList?: Number[];

	@IsOptional()
	@Field(() => [Int], { nullable: true })
	agesList?: Number[];

	@IsOptional()
	@IsIn(availableOptions, { each: true })
	@Field(() => [String], { nullable: true })
	options?: string[];

	@IsOptional()
	@Field(() => PricesRange, { nullable: true })
	pricesRange?: PricesRange;

	@IsOptional()
	@Field(() => PeriodsRange, { nullable: true })
	periodsRange?: PeriodsRange;

	@IsOptional()
	@Field(() => WeightsRange, { nullable: true })
	weightRange?: WeightsRange;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class PetsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availablePetSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => PISearch)
	search: PISearch;
}
@InputType()
export class APISearch {
	@IsOptional()
	@Field(() => PetStatus, { nullable: true })
	petStatus?: PetStatus;
}

@InputType()
export class SellerPetsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availablePetSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => APISearch)
	search: APISearch;
}

@InputType()
class ALPISearch {
	@IsOptional()
	@Field(() => PetStatus, { nullable: true })
	petStatus?: PetStatus;

	@IsOptional()
	@Field(() => [PetLocation], { nullable: true })
	petLocationList?: PetLocation[];
}

@InputType()
export class AllPetsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availablePetSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => ALPISearch)
	search: ALPISearch;
}

@InputType()
export class OrdinaryInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;
}
