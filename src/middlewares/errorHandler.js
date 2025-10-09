import { HttpError } from 'http-errors';

export default function errorHandler(err, req, res, next) {
  console.log('HandleErr', err);
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err.data,
    });
    return;
  }
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.data,
  });
}
