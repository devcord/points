import BCRYPT from 'bcrypt';
import MONGOOSE from 'mongoose';

type toNormalizationFunction = () => UserType;

export type UserDocument = MONGOOSE.Document & {
  id: string
  points: number,
  toNormalization: toNormalizationFunction
};

export type UserType = {
  id: string | null,
  points: number | null,
};

const userSchema = new MONGOOSE.Schema(
  {
    id: { type: String, unique: true, required: true },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const toNormalization: toNormalizationFunction = function () {
  let _userObject: UserDocument = this.toObject();

  let UserObject: UserType = {
    id: _userObject.id,
    points: _userObject.points,
  };

  return UserObject;
};

userSchema.methods.toNormalization = toNormalization;

const User = MONGOOSE.model<UserDocument>('User', userSchema);

export default User;