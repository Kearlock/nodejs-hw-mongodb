import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { UsersCollection } from '../db/model/user.js';
import { Session } from '../db/model/session.js';
import createHttpError from 'http-errors';

export async function registerUser(payload) {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user !== null) {
    throw new createHttpError.Conflict('Email is already is use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create(payload);
}

export async function loginUser(email, password) {
  const user = await UsersCollection.findOne({ email });

  if (user === null) {
    // console.log('Email');
    throw new createHttpError.Unauthorized('Email is incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch !== true) {
    // console.log('Password');
    throw new createHttpError.Unauthorized('Password is incorrect');
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });
}

export async function logoutUser(sessionId) {
  await Session.deleteOne({ _id: sessionId });
}

export async function refreshSession(sessionId, refreshToken) {
  const session = await Session.findById(sessionId);

  if (session === null) {
    throw new createHttpError.Unauthorized('Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw new createHttpError.Unauthorized('Refresh token is invalid');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized('Refresh token is expired');
  }

  await Session.deleteOne({ _id: session._id });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });
}
