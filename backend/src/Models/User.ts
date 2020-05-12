import * as mongoose from 'mongoose';

type toNormalizationFunction = () => UserType;

export type UserDocument = mongoose.Document & {
  id: string;
  points: number;
  toNormalization: toNormalizationFunction;
};

export type UserType = {
  id: string | null;
  points: number | null;
};

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  points: { type: Number, default: 0 },
}, { timestamps: true });

const toNormalization: toNormalizationFunction = function () {
  let _userObject: UserDocument = this.toObject();

  let UserObject: UserType = {
    id: _userObject.id,
    points: _userObject.points,
  };

  return UserObject;
};


userSchema.methods.toNormalization = toNormalization;

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;