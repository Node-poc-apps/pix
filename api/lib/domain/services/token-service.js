const jsonwebtoken = require('jsonwebtoken');

const settings = require('../../settings');

function createTokenFromUser(user) {
  return jsonwebtoken.sign({
    user_id: user.get('id'),
    email: user.get('email')
  }, settings.authentication.secret, { expiresIn: settings.authentication.tokenLifespan });
}

function extractTokenFromAuthChain(authChain) {
  if (!authChain) {
    return authChain;
  }
  const bearerIndex = authChain.indexOf('Bearer ');
  if (bearerIndex < 0) {
    return false;
  }
  return authChain.replace(/Bearer /g, '');
}

function verifyValidity(token) {
  try {
    return jsonwebtoken.verify(token, settings.authentication.secret);
  }
  catch (err) {
    return false;
  }
}

function extractUserId(token) {
  const decoded = verifyValidity(token);
  return decoded.user_id || null;
}

module.exports = {
  createTokenFromUser,
  extractUserId,
  extractTokenFromAuthChain,
  verifyValidity
};
