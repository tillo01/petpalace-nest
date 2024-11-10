import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PetService } from './pet.service';
import {
	SellerPetsInquiry,
	AllPetsInquiry,
	OrdinaryInquiry,
	PetsInquiry,
	PetInput,
} from '../../libs/dto/pet/pet.input';
import { MemberType } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Pets, Pet } from '../../libs/dto/pet/pet';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { PetUpdate } from '../../libs/dto/pet/pet.update';
import { AuthGuard } from '../auth/guards/auth.guard';

@Resolver()
export class PetResolver {
	constructor(private readonly petService: PetService) {}

	@Roles(MemberType.SELLER)
	@UseGuards(RolesGuard)
	@Mutation(() => Pet)
	public async createPet(@Args('input') input: PetInput, @AuthMember('_id') memberId: ObjectId): Promise<Pet> {
		console.log('Mutation:createPet');
		input.memberId = memberId;

		return await this.petService.createPet(input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Pet)
	public async getPet(@Args('petId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Pet> {
		console.log('Query: getPet');
		const petId = shapeIntoMongoObjectId(input);
		return await this.petService.getPet(memberId, petId);
	}

	@Roles(MemberType.SELLER)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Pet)
	public async updatePet(@Args('input') input: PetUpdate, @AuthMember('_id') memberId: ObjectId): Promise<Pet> {
		console.log('Mutation: updatePet');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.petService.updatePet(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Pets)
	public async getPets(@Args('input') input: PetsInquiry, @AuthMember('_id') memberId: ObjectId): Promise<Pets> {
		console.log('Query: getPets');
		return await this.petService.getPets(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => Pets)
	public async getFavorites(
		@Args('input') input: OrdinaryInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Pets> {
		console.log('Query: getFavorites');
		return await this.petService.getFavorites(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => Pets)
	public async getVisited(@Args('input') input: OrdinaryInquiry, @AuthMember('_id') memberId: ObjectId): Promise<Pets> {
		console.log('Query: getFavorites');
		return await this.petService.getVisited(memberId, input);
	}

	@Roles(MemberType.SELLER)
	@UseGuards(RolesGuard)
	@Query((returns) => Pets)
	public async getSellerPets(
		@Args('input') input: SellerPetsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Pets> {
		console.log('Query: getSellerPets');
		return await this.petService.getSellerPets(memberId, input);
	}

	/** ADMIN **/
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query((returns) => Pets)
	public async getAllPetsByAdmin(
		@Args('input') input: AllPetsInquiry,
		@AuthMember() memberId: ObjectId,
	): Promise<Pets> {
		console.log('Query: getAllPetsByAdmin');
		return await this.petService.getAllPetsByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Pet)
	public async updatePetByAdmin(@Args('input') input: PetUpdate): Promise<Pet> {
		console.log('Mutation: updatePetByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.petService.updatePetByAdmin(input);
	}

	@Mutation(() => Pet)
	@UseGuards(RolesGuard)
	public async removePetByAdmin(@Args('petId') input: string): Promise<Pet> {
		console.log('Mutation: removePetByAdmin');
		const petId = shapeIntoMongoObjectId(input);
		return await this.petService.removePetByAdmin(petId);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Pet)
	public async likeTargetPet(@Args('petId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Pet> {
		console.log('likeTargetMember');
		const likeRefId = shapeIntoMongoObjectId(input);
		return await this.petService.likeTargetPet(memberId, likeRefId);
	}
}
