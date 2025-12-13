import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_DATABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
};

export default async (request) => {

    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                ...headers,
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            }
        });
    }

    try {
        const { origin } = await request.json();

        if (!origin) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'origin is required'
                }),
                { status: 400, headers }
            );
        }

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${origin}/auth/callback.html`
            }
        });

        if (error) {
            return new Response(
                JSON.stringify({ success: false, error: error.message }),
                { status: 500, headers }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                url: data.url
            }),
            { status: 200, headers }
        );

    } catch (err) {
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            { status: 500, headers }
        );
    }
};