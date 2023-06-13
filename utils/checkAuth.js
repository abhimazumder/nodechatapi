"use strict";

const jwt = require("jsonwebtoken");

const checkAuth = (event) => {

    const authorizationHeader = event.headers["Authorization"];

    if (!authorizationHeader) {
        const error = new Error("Missing Authorization header!");
        error.statusCode = 401;
        throw error;
    }

    const [bearer, token] = authorizationHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
        const error = new Error("Invalid Authorization header format!");
        error.statusCode = 401;
        throw error;
    }

    const decoded = jwt.verify(token, "process.env.SECURE_KEY");

    return {
        email: decoded.user,
        token : token
    }
};

module.exports = { checkAuth };


/*console.log(checkAuth({
    "headers" : {
        "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWJoaXNoZWtAZ21haWwuY29tIiwidHlwZSI6IkFDQ0VTU19UT0tFTiIsImlhdCI6MTY4NTUxOTI5NiwiZXhwIjoxNjg1NTIwMTk2fQ.lUZmAQui0WGaKYzc7F5b-LJe53d6s2GFv0XrjpHXLmw"
    }
}));
*/