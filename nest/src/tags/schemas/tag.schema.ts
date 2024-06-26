import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema()
export class Tag {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  color: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  _owner: User;
}

export type TagDocument = HydratedDocument<Tag>;

export const TagSchema = SchemaFactory.createForClass(Tag).index(
  { name: 1, _owner: 1 },
  { unique: true },
);
