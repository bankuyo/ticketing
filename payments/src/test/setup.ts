import  request  from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { app } from '../app'

declare global {
  var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper')

process.env.STRIPE_KEY = "sk_test_51KvhRMKNLTVoeo9YpS01Kj3aCCKUSkjqSIgBbV4YrL1OSDV7cYQMMbSGHLp2STEPehYHXVj2iXNTH7swBEx6y1qZ0072mglm55"

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

global.signin = (id?: string) => {
  // Build a JWT payload { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
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