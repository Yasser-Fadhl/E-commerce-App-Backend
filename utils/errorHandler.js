class ErrorHandler extends Error {
  constructor(message, errorStatus) {
    super(message);
    this.errorStatus = errorStatus;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ErrorHandler;
