import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Directory {
  @Prop()
  icon: string;

  @Prop()
  title: string;

  @Prop()
  color: string;
}

export type DirectoryDocument = HydratedDocument<Directory>;

export const DirectorySchema = SchemaFactory.createForClass(Directory);
