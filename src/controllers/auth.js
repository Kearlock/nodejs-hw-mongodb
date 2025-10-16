import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  requestPasswordReset,
  resetPassword,
} from '../services/auth.js';

export async function registerUserCtrl(req, res) {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
}

export async function loginUserCtrl(req, res) {
  const session = await loginUser(req.body.email, req.body.password);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'User login successfully',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function refreshSessionCtrl(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshSession(sessionId, refreshToken);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Refresh session successfully',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutUserCtrl(req, res) {
  const { sessionId } = req.cookies;

  if (typeof sessionId === 'string') {
    await logoutUser(sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.send({ status: 200, message: 'User logout successfully' });
}

export async function requestPasswordResetCtrl(req, res) {
  await requestPasswordReset(req.body.email);

  res.json({ status: 200, message: 'Email successfully sent' });
}

export async function resetPasswordCtrl(req, res) {
  await resetPassword(req.body.token, req.body.password);

  res.json({ status: 200, message: 'Reset password successfully' });
}
