import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  // Extracting access_token from the request
  const accessToken = extractAccessToken(req);

  if (!accessToken) {
    return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized"));
    }
    req.user = user;
    next();
  });
};

// Function to extract access_token from IncomingMessage object
function extractAccessToken(req) {
  // Get the rawHeaders array
  const rawHeaders = req.rawHeaders;

  // Find the index of the "Cookie" header
  const cookieIndex = rawHeaders.indexOf('Cookie');

  if (cookieIndex !== -1) {
    // Get the cookie header value
    const cookieValue = rawHeaders[cookieIndex + 1];

    // Split the cookie string to separate individual cookies
    const cookies = cookieValue.split('; ');

    // Iterate through individual cookies to find the access_token
    for (const cookie of cookies) {
      // Check if the cookie contains the access_token
      if (cookie.startsWith('access_token=')) {
        // Extract the access_token value
        const accessToken = cookie.split('=')[1];
        return accessToken;
      }
    }
  }

  // Return null if access_token is not found
  return null;
}
