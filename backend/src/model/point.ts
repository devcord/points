import MONGOOSE from 'mongoose';

type toNormalizationFunction = () => PointType;
type mapFunction = () => PointType[];

export type PointDocument = MONGOOSE.Document & {
  userID: string;
  amount: number;
  type: string;
  toNormalization?: toNormalizationFunction;
  date?: string;
};

export type PointType = {
  id: string;
  userID: string;
  type: string;
  amount: number;
  date: string;
};

const pointSchema = new MONGOOSE.Schema(
  {
    date: { type: Date, default: Date.now, index: true },
    userID: { type: String, required: true, index: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

const toNormalization: toNormalizationFunction = function () {
  const _userObject: PointDocument = this.toObject();

  const PointObject: PointType = {
    id: _userObject._id.toString(),
    userID: _userObject.userID,
    type: _userObject.type,
    amount: _userObject.amount,
    date: _userObject.date,
  };

  return PointObject;
};


pointSchema.methods.toNormalization = toNormalization;

const Point = MONGOOSE.model<PointDocument>('Point', pointSchema);

export default Point;
