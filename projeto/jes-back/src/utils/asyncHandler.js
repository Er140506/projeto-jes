/**
 * src/middlewares/asyncHandler.js
 * Envolve um controller assíncrono e encaminha qualquer erro para o
 * errorHandler central, evitando repetir try/catch em cada função.
 */
 function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default asyncHandler;
    