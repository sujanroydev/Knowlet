import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(process.env.SUPABASE_DATABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event) => {
    const code = event.queryStringParameters.code;

    const params = new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "https://knowlet.in/.netlify/functions/google-callback",
        grant_type: "authorization_code"
    });

    const tokenRes = await fetch(
        "https://oauth2.googleapis.com/token",
        {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        }
    );

    const tokenData = await tokenRes.json();

    const userRes = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`
            }
        }
    );

    const user = await userRes.json();

	try {
		const { data, error } = await supabaseClient
			.from('user')
			.select('id')
			.eq('email', user.email)
		if (error) {
			return {
				statusCode: 503,
				headers: {
					Location: `https://knowlet.in/response.html?error=${encodeURIComponent(error)}`
				}
			}
		}
		if (data.length) {
			try {
				const { error } = await supabaseClient
					.from('user')
					.update({ 'is_verified': user.email_verified, 'verified_at': Date.now()})
					.eq('email', user.email);
				if (error) {
					return {
						statusCode: 503,
						headers: {
							Location: `https://knowlet.in/response.html?error=${encodeURIComponent(error)}`
						}
					}
				}
			} catch(err) {
				return {
					statusCode: 500,
					headers: {
						Location: `https://knowlet.in/response.html?error=${encodeURIComponent(err)}`
					}
				}
			}
		}
	} catch(err) {
		return {
			statusCode: 500,
			headers: {
				Location: `https://knowlet.in/response.html?error=${encodeURIComponent(err)}`
			}
		}
	}

    return {
        statusCode: 302,
        headers: {
            Location: `https://knowlet.in/response.html?user=${encodeURIComponent(
                JSON.stringify(user)
            )}`
        }
    };
};