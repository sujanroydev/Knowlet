import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(process.env.SUPABASE_DATABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async (request) => {

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

    const { user_id, page_id, page_title } = await request.json();

    try {
        if ( !user_id || !page_id ) throw new Error('missing parameters');

        const { data, error: err1 } = await supabaseClient
            .from("ratings")
            .select("page_likes, interactions_time")
            .eq("user_id", user_id)
            .eq("page_id", page_id);

        if (err1) throw new Error(err1);

        let error;

        if (data.length) {
            ({ error } = await supabaseClient
                .from("ratings")
                .update({
                    page_likes: data[0].page_likes ? 0 : 1,
                    interactions_time: {
                        faved_at: data[0].interactions_time.faved_at,
                        liked_at: new Date().toISOString(),
                        rated_at: data[0].interactions_time.rated_at
                    }
                })
                .eq("page_id", page_id)
                .eq("user_id", user_id)
            );
        } else {
            ({ error } = await supabaseClient
                .from("ratings")
                .insert({
                    user_id,
                    page_id,
                    page_title,
                    page_likes: 1,
                    interactions_time: {
                        faved_at: null,
                        liked_at: new Date().toISOString(),
                        rated_at: null
                    }
                })
            );
        }

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
                data: [{ page_likes: data.length ? (data[0].page_likes ? 0 : 1) : 1}]
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