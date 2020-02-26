import { Schema, model } from 'mongoose';
import { IModelsOpts, IRole, IIAMModel, IIAM, IRoleModel } from './interfaces';

export default function (opts: IModelsOpts): IRoleModel {
  const RoleSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: String,
    description: String,
    iams: [{
      type: Schema.Types.ObjectId,
      ref: 'IAM',
      required: true,
    }],
    protected: {
      type: Boolean,
      default: false,
    },
  }, {
    timestamps: true,
    collection: 'roles',
  });

  RoleSchema.statics.getIAMs = async function getIAMs(roles = []): Promise<IIAM[]> {
    const IAM = model<IIAM>(opts.iams.modelName) as IIAMModel;
    let list = roles
      .filter((r) => Boolean(r) && typeof r === 'string');

    list = await this.find({ name: list });
    list = list.filter(Boolean)
      .map((r) => r.iams)
      .filter(Boolean)
      .flat();

    list = await IAM.getChildren(list);

    return list;
  };

  const RoleModel = model<IRole>(opts.roles.modelName, RoleSchema) as IRoleModel;
  RoleModel.createIndexes();

  return RoleModel;
}
