import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { UsersCollection } from '../db/model/user.js';
import { Session } from '../db/model/session.js';
import createHttpError from 'http-errors';

import * as fs from 'node:fs';
import path from 'node:path';
import jwt from 'jsonwebtoken';
import Handlebars from 'handlebars'; //to consider
import { sendMail } from '../utils/sendMail.js';
import { getEnvVariable } from '../utils/getEnvVariable.js';

const REQUEST_PASSWORD_RESET_TEMPLATE = fs.readFileSync(
  path.resolve('src/templates/request-password-reset.html'),
  { encoding: 'UTF-8' },
);

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

export async function requestPasswordReset(email) {
  const user = await UsersCollection.findOne({ email });

  if (user === null) {
    return;
  }

  const token = jwt.sign({ sub: user._id }, getEnvVariable('JWT_SECRET'), {
    expiresIn: '15m',
  });

  const template = Handlebars.compile(REQUEST_PASSWORD_RESET_TEMPLATE);

  await sendMail({
    to: email,
    subject: 'Reset password instruction',
    html: template({
      resetPasswordLink: `https://nodejs-hw-mongodb-ipwg.onrender.com/reset-password?token=${token}`,
    }),
  });
}

export async function resetPassword(token, password) {
  try {
    const decoded = jwt.verify(token, getEnvVariable('JWT_SECRET'));

    const hashedPassword = await bcrypt.hash(password, 10);

    await UsersCollection.findByIdAndUpdate(decoded.sub, {
      password: hashedPassword,
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw createHttpError.Unauthorized('Token is expired');
    }

    if (error.name === 'JsonWebTokenError') {
      throw createHttpError.Unauthorized('Token is unauthorized');
    }

    throw error;
  }
}
