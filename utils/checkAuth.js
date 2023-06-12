"use strict";

const jwt = require("jsonwebtoken");

const checkAuth = (event) => {
    try {
        const authorizationHeader = event.headers["Authorization"];

        if (!authorizationHeader) {
            throw new Error("Missing Authorization header!");
        }

        const [bearer, token] = authorizationHeader.split(" ");

        if (bearer !== "Bearer" || !token) {
            throw new Error("Invalid Authorization header format!");
        }

        var decoded = jwt.verify(token, "process.env.SECURE_KEY");

        return decoded.user;
    } catch (err) {
        return err.message;
    }
};

module.exports = { checkAuth };


/*console.log(checkAuth({
    "headers" : {
        "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWJoaXNoZWtAZ21haWwuY29tIiwidHlwZSI6IkFDQ0VTU19UT0tFTiIsImlhdCI6MTY4NTUxOTI5NiwiZXhwIjoxNjg1NTIwMTk2fQ.lUZmAQui0WGaKYzc7F5b-LJe53d6s2GFv0XrjpHXLmw"
    }
}));
*/