import mongoose, {HydratedDocument} from 'mongoose';
import bcrypt from 'bcrypt';
import {UserFields, UserMethods, UserModel} from '../types';
import {randomUUID} from 'crypto';

const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema<HydratedDocument<UserFields>, UserModel, UserMethods>({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (this: HydratedDocument<UserFields>, value: string): Promise<boolean> {
        if (!this.isModified('username')) return true;
        const user: UserFields | null = await User.findOne({username: value});
        return !user;
      },
      message: 'This user already exists',
    }
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['user', 'admin'],
  },
  displayName: {
    type: String,
    required: true,
  },
  avatar: String,
  googleID: String,
  token: {
    type: String,
    required: true,
  }
});

UserSchema.methods.checkPassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
  this.token = randomUUID();
};
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.set('toJSON', {
  transform: (_doc, ret, _options) => {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model<HydratedDocument<UserFields>, UserModel>('User', UserSchema);

export default User;