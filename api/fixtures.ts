import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Message from './models/Message';


const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection("users");
    await db.dropCollection("messages");
  } catch (e) {
    console.log("Collections were not presents")
  }

  const [Martin, Lazlo] = await User.create(
    {
      username: "Martin",
      password: "123",
      token: crypto.randomUUID(),
      displayName: "Martin"
    },
    {
      username: "Lazlo",
      password: "123",
      token: crypto.randomUUID(),
      displayName: "Lazlo"
    }
  )

  await Message.create(
    {
      user: Martin._id,
      text: "Hello 1"
    },
    {
      user: Martin._id,
      text: "Hello 2"
    },
    {
      user: Martin._id,
      text: "Hello 3"
    },
    {
      user: Martin._id,
      text: "Hello 4"
    },
    {
      user: Martin._id,
      text: "Hello 5"
    },
    {
      user: Martin._id,
      text: "Hello 6"
    },
    {
      user: Martin._id,
      text: "Hello 7"
    },
    {
      user: Martin._id,
      text: "Hello 8"
    },
    {
      user: Martin._id,
      text: "Hello 10"
    },
    {
      user: Martin._id,
      text: "Hello 11"
    },
    {
      user: Martin._id,
      text: "Hello 12"
    },
    {
      user: Martin._id,
      text: "Hello 13"
    },
    {
      user: Martin._id,
      text: "Hello 14"
    },
    {
      user: Martin._id,
      text: "Hello 15"
    },
    {
      user: Martin._id,
      text: "Hello 16"
    },
    {
      user: Martin._id,
      text: "Hello 17"
    },
    {
      user: Martin._id,
      text: "Hello 18"
    },
    {
      user: Martin._id,
      text: "Hello 19"
    },
    {
      user: Martin._id,
      text: "Hello 20"
    },
    {
      user: Lazlo._id,
      text: "Hello 21"
    },
    {
      user: Lazlo._id,
      text: "Hello 22"
    },
    {
      user: Lazlo._id,
      text: "Hello 23"
    },
    {
      user: Lazlo._id,
      text: "Hello 24"
    },
    {
      user: Lazlo._id,
      text: "Hello 25"
    },
    {
      user: Lazlo._id,
      text: "Hello 26"
    },
    {
      user: Lazlo._id,
      text: "Hello 27"
    },
    {
      user: Lazlo._id,
      text: "Hello 28"
    },
    {
      user: Lazlo._id,
      text: "Hello 29"
    },
    {
      user: Lazlo._id,
      text: "Hello 30"
    },
    {
      user: Lazlo._id,
      text: "Hello 31"
    },
    {
      user: Lazlo._id,
      text: "Hello 32"
    }
  )

  await db.close();

}

run().catch(console.error);