import { Schema } from 'mongoose';
import { PetLocation, PetStatus, PetType } from '../libs/enums/pet.enum';

const PetSchema = new Schema(
	{
		petType: {
			type: String,
			enum: PetType,
			required: true,
		},

		petStatus: {
			type: String,
			enum: PetStatus,
			default: PetStatus.ACTIVE,
		},

		petLocation: {
			type: String,
			enum: PetLocation,
			required: true,
		},

		petAddress: {
			type: String,
			required: true,
		},

		petTitle: {
			type: String,
			required: true,
		},

		petPrice: {
			type: Number,
			required: true,
		},

		petWeight: {
			type: Number,
			required: true,
		},

		petHeight: {
			type: Number,
			required: true,
		},

		petAges: {
			type: Number,
			required: true,
		},

		petViews: {
			type: Number,
			default: 0,
		},

		petLikes: {
			type: Number,
			default: 0,
		},

		petComments: {
			type: Number,
			default: 0,
		},

		petRank: {
			type: Number,
			default: 0,
		},

		petImages: {
			type: [String],
			required: true,
		},

		petDesc: {
			type: String,
		},

		petSell: {
			type: Boolean,
			default: false,
		},

		petAdoption: {
			type: Boolean,
			default: false,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		soldAt: {
			type: Date,
		},

		deletedAt: {
			type: Date,
		},

		bornAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'pets' },
);

PetSchema.index({ petType: 1, petLocation: 1, petTitle: 1, petPrice: 1 }, { unique: true });

export default PetSchema;
