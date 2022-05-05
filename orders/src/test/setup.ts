import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

declare global {
  var signin: () => string[];
}

jest.mock('../nats-wrapper')

let mongo: any;

beforeAll(async() => {
  jest.clearAllMocks();
  process.env.JWT_KEY = "key";
  mongo = await MongoMemoryServer.create();;
  const mongoUri = await mongo.getUri();

  await  mongoose.connect(mongoUri);
})

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({})
  }
});

afterAll(async() => {
  await mongoose.connection.close(); // This first
  await mongo.stop(); // Then this
})

global.signin = () => {
  // Build a JWT payload { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com"
  }

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build a session Object { jwt: MY_JWT }
  const session = {jwt: token}

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie
  return  [`session=${base64}`];
}