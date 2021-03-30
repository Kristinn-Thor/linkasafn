const jwt = require('jsonwebtoken');

function getTokenPayload(token) {
  return jwt.verify(token, process.env.APP_SECRET);
}

/**
 * 
 * @param {object} req request frá client
 * @returns {string} JasonWebToken sem tilgreinir notanda
 */
function getUserId(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        throw new Error('No token found');
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  }
  throw new Error('Not authenticated');
}

const validatePassword = (password) => {
  // Lykilorð verður að vera 8-200 stafir. Innihalda a.m.k. einn stóran staf og einn lítinn staf. Má innihalda tákn.
  const isValid = password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,200}$/);
  if (isValid) return true;
  return false;
};


module.exports = {
  getTokenPayload,
  getUserId,
  validatePassword
}