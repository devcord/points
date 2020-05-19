import MONGOOSE from 'mongoose';

type toNormalizationFunction = () => PointType;

export type PointDocument = MONGOOSE.Document & {
  amount: number;
  userID: string;
  toNormalization: toNormalizationFunction;
  date: string;
};

export type PointType = {
  id: string;
  userID: string;
  amount: number;
  date: string;
};

const pointSchema = new MONGOOSE.Schema(
  {
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    userID: {type: String, required: true}
  },
  { timestamps: true }
);

const toNormalization: toNormalizationFunction = function () {
  const _userObject: PointDocument = this.toObject();

  const PointObject: PointType = {
    id: _userObject._id.toString(),
    userID: _userObject.userID,
    amount: _userObject.amount,
    date: _userObject.date,
  };

  return PointObject;
};


pointSchema.methods.toNormalization = toNormalization;

const Point = MONGOOSE.model<PointDocument>('Point', pointSchema);

export default Point;