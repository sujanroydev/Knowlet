import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_DATABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default async (request) => {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            }
        });
    }
    
    // 1. Read JSON body
    const body = await request.json();
    const { email, id } = body;
    
    // 2. Use values safely
    let query = supabase.from('user').select('*').eq('id', id).eq('email', email);
    
    // if (limit) query = query.eq('id', id);
    
    // if (email) query = query.eq('email', email);

    try {
        const { data, error } = await query;

        if (error) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: error.message
                }),
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                data
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );

    } catch (err) {
        return new Response(
            JSON.stringify({
                success: false,
                error: err.message
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );
    }
};