"use strict";

const jwt = require("jsonwebtoken");
const { createTokens } = require("../utils/createTokens");

module.exports.handler = async (event) => {
    try {
        const { refreshToken } = JSON.parse(event.body);

        if (!refreshToken) {
            throw new Error("Refresh token is required!");
        }

        var decoded = jwt.verify(refreshToken, "process.env.SECURE_KEY");

        const tokens = createTokens(decoded);

        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST",
            },
            body: JSON.stringify({
                tokens: tokens,
            }),
        };
    }
    catch (err) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST",
            },
            body: JSON.stringify({
                message: (err instanceof jwt.TokenExpiredError) ?
                    "Refresh token has expired!" : "Refresh token is invalid!",
                decoded: decoded
            }),
        };
    }
};