import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  MongoQuery,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Tag } from '../tags/schemas/tag.schema';
import { User } from '../users/schemas/user.schema';
import { Directory } from '../directories/schemas/directory.schema';
import { Note } from '../notes/schemas/note.schema';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects =
  | InferSubjects<typeof User | typeof Tag | typeof Directory | typeof Note>
  | 'all';
type PossibleAbilities = [Action, Subjects];
type Conditions = MongoQuery;
export type AppAbility = MongoAbility<PossibleAbilities, Conditions>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder(
      createMongoAbility<PossibleAbilities, Conditions>,
    );

    can([Action.Read, Action.Update], User, { _id: user._id });
    can(Action.Manage, Tag, { _owner: user._id });
    can(Action.Manage, Directory, { _owner: user._id });
    can(Action.Manage, Note, { _owner: user._id });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
