import MONGOOSE from 'mongoose';
import PointModel, { PointDocument, PointType } from "./point";

type toNormalizationFunction = () => UserType;

export type UserDocument = MONGOOSE.Document & {
  id: string;
  totalPoints: number;
  points: string[];
  toNormalization: toNormalizationFunction;
};

export type UserType = {
  id: string | null;
  totalPoints: number | null;
  points: string[];
};

const userSchema = new MONGOOSE.Schema(
  {
    id: { type: String, unique: true, required: true },
    totalPoints: { type: Number, default: 0 },
    points: { type: Array, required: false},
  },
  { timestamps: true }
);

const toNormalization: toNormalizationFunction = function () {
  const _userObject: UserDocument = this.toObject();

  const UserObject: UserType = {
    id: _userObject.id,
    totalPoints: _userObject.totalPoints,
    points: _userObject.points,
  };

  return UserObject;
};


userSchema.methods.toNormalization = toNormalization;

const User = MONGOOSE.model<UserDocument>('User', userSchema);

export default User;