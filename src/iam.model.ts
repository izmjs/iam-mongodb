import { Schema, model, Types } from 'mongoose';
import { IIAM, IIAMModel, IModelOpts, IModelsOpts } from './interfaces';

export default function (opts: IModelsOpts): IIAMModel {
  const IAMSchema: Schema = new Schema({
    iam: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    title: String,
    description: String,
    resource: String,
    permission: String,
    module: String,
    affectable: {
      type: Boolean,
      default: true,
      required: true,
    },
    system: {
      type: Boolean,
      default: false,
      required: true,
    },
    children: {
      type: [{
        type: Schema.Types.ObjectId,
        ref: 'IAM',
      }],
      default: [],
    },
    excluded: {
      type: Boolean,
      default: false,
    },
    groups: {
      type: [{
        type: String,
        trim: true,
        lowercase: true,
        required: true,
      }],
      default: [],
    },
  }, {
    collection: opts.iams.collectionName,
  });

  IAMSchema.statics.getChildren = async function getChildren(
    ids: Types.ObjectId[] = [],
    cache: IIAM[] = [],
  ): Promise<IIAM[]> {
    const list = ids
      // Convert all IDs to strings
      .map((id) => id.toString())
      // Remove dupplicated
      .filter((id, index, arr) => index === arr.indexOf(id))
      // Filter uncached IDs
      .filter((id) => {
        const f = cache.find((one) => one.id === id);
        return !f;
      });

    if (list.length === 0) {
      return cache;
    }

    let found = await this.find({ _id: list });

    const children = found
      .map((iam) => iam.children)
      .filter(Boolean)
      .flat();

    found = cache.concat(found);

    if (children.length === 0) {
      return found;
    }

    found = await this.getChildren(children, found);

    return found;
  };

  const IAMModel = model<IIAM>(opts.iams.modelName, IAMSchema) as IIAMModel;
  IAMModel.createIndexes();

  // Export the model and return your IUser interface
  return IAMModel;
}
