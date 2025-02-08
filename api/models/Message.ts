import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text:{
    type: String,
    required: true,
  },
  datetime:{
    type: Date,
    default: new Date().toISOString(),
    required: true,
  }

})

const Message = mongoose.model('Message', MessageSchema);
export default Message;