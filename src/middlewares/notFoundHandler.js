import createHttpError from 'http-errors';

export default function notFoundHandler() {
  throw createHttpError(404, 'Route not found');
}
