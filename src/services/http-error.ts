import Boom from '@hapi/boom';

class HttpError {
  static unauthorized(message?: string) {
    return Boom.unauthorized(message);
  }

  static notFound(message?: string) {
    return Boom.notFound(message);
  }

  static badRequest(message?: string) {
    return Boom.badRequest(message);
  }
}

export default HttpError;
