const jwt = require("jsonwebtoken");

const createTokens = (payload) => {
  const accessToken = jwt.sign(
    { user: payload, type: "ACCESS_TOKEN" },
    "process.env.SECURE_KEY",
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    { user: payload, type: "REFRESH_TOKEN" },
    "process.env.SECURE_KEY",
    {
      expiresIn: "10d",
    }
  );

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

module.exports = { createTokens };
