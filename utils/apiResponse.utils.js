// This is API Response utility to send response in a consistent format for success and error responses.

/** Success Response
 * @param { Object } res - Express response object
 * @param { Number } statusCode - HTTP status code
 * @param { String } message - Success message
 * @param { Object } data - Response data
 */

const successResponse = (
  res,
  statusCode = 200,
  message = "Success",
  data = null,
  token = null
) => {
  const response = {
    success: true,
    message,
  };

  if (data) {
    response.data = data;
  }

  // Include token in response if provided
  if (token) {
    response.token = token;
  }

  return res.status(statusCode).json(response);
};

/** Error Response
 * @param { Object } res - Express response object
 * @param { Number } statusCode - HTTP status code
 * @param { String } message - Error message
 * @param { Object } error - Error object
 */

const errorResponse = (
  res,
  statusCode = 500,
  message = "Error",
  errors = null
) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

export { successResponse, errorResponse };
