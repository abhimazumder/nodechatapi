"use strict";

const { checkAuth } = require("../utils/checkAuth");

module.exports.handler = async (event) => {
    try {
        const { email, token } = checkAuth(event);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET",
            },
            body: JSON.stringify({
                token : token,
            }),
        }
    }
    catch(err){
        if(err.message === "jwt malformed" || err.message === "jwt expired"){
            err.statusCode = 403;
        }
        return {
            statusCode: err.statusCode || 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET",
            },
            body: JSON.stringify({
                message: err.message
            })
        };
    }
}