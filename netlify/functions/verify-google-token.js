const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.handler = async (event) => {
    try {
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: "Method not allowed" })
            };
        }

        const { token } = JSON.parse(event.body);

        if (!token) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Token missing" })
            };
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        // Basic user info from Google
        const user = {
            googleId: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture
        };

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                user
            })
        };

    } catch (err) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                success: false,
                error: "Invalid or expired token"
            })
        };
    }
};