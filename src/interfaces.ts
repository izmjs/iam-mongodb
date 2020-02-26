import { MongoClientOptions, MongoClient } from "mongodb";
import { Connection, Types, Document, Model } from "mongoose";

export interface IAdapterOptions {
  url?: string;
  mongoOptions?: MongoClientOptions;
  mongooseConnection?: Connection;
  client?: MongoClient;
  collections: ICollections;
  dbName?: string;
}

export interface IIAMBase {
  iam: string;
  title?: string;
  module?: string;
  groups?: string[];
  description?: string;
  system?: boolean;
  affectable?: boolean;
  excluded?: boolean;
}

export interface IIamOpts extends IIAMBase{
  parents?: string[];
}

export interface IIamModelBase extends IIAMBase {
  children?: (Types.ObjectId | IIAM)[];
  permission?: string;
  resource?: string;
}

export interface IIAM extends Document, IIamModelBase {};

export interface IIAMModel extends Model<IIAM> {
  getChildren: (ids: Types.ObjectId[], cache?: IIAM[]) => Promise<IIAM[]>;
};

export interface IRole extends Document {
  name: string;
  title: string;
  description: string;
  iams: (Types.ObjectId | IRole)[];
  resource: string;
  permission: string;
  module: string;
  affectable: boolean;
  system: boolean;
  excluded: boolean;
  groups: string[];
};

export interface IRoleModel extends Model<IRole> {
  getIAMs: (roles: string[]) => Promise<IIAM[]>;
};

export interface IModelOpts {
  collectionName: string;
  modelName: string;
}

export interface IModelsOpts {
  iams: IModelOpts;
  roles: IModelOpts;
}

export interface ICollections {
  iams: string;
  roles: string;
}
