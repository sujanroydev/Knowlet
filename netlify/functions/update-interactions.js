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

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    const { user_id, page_id, page_title, page_ratings, ratings_message } = await request.json();

    try {
        if (!action) throw new Error('Missing quary parameter action');
        if ( !user_id || !page_id) throw new Error('Missing parameters page id and user id');

        const { data, error: err1 } = await supabaseClient
            .from("interactions")
            .select("*")
            .eq("user_id", user_id)
            .eq("page_id", page_id);

        if (err1) throw new Error(err1);

        let error;
        let pageInfo = {
            user_id,
            page_id,
            page_title
        };
        let pageState;

        if (action === "likes") {
            if (data.length){
                pageState = {
                    page_likes: data[0].page_likes ? 0 : 1,
                    interactions_time: {
                        faved_at: data[0].interactions_time.faved_at,
                        liked_at: new Date().toISOString(),
                        rated_at: data[0].interactions_time.rated_at
                    }
                };
            }
            else {
                pageState = {
                    page_likes: 1,
                    interactions_time: {
                        faved_at: null,
                        liked_at: new Date().toISOString(),
                        rated_at: null
                    }
                };
            }
        } else if (action === "ratings") {
            if (data.length){
                pageState = {
                    page_ratings: page_ratings || data[0].page_ratings,
                    ratings_message: ratings_message || data[0].ratings_message,
                    interactions_time: {
                        faved_at: data[0].interactions_time.faved_at,
                        liked_at: data[0].interactions_time.liked_at,
                        rated_at: new Date().toISOString()
                    }
                };
            }
            else {
                pageState = {
                    page_ratings,
                    ratings_message,
                    interactions_time: {
                        faved_at: null,
                        liked_at: null,
                        rated_at: new Date().toISOString()
                    }
                };
            }
        } else if (action === "favs") {
            if (data.length){
                pageState = {
                    is_fav: !(data[0].is_fav),
                    interactions_time: {
                        faved_at: new Date().toISOString(),
                        liked_at: data[0].interactions_time.liked_at,
                        rated_at: data[0].interactions_time.rated_at
                    }
                };
            }
            else {
                pageState = {
                    is_fav: true,
                    interactions_time: {
                        faved_at: new Date().toISOString(),
                        liked_at: null,
                        rated_at: null
                    }
                };
            }
        }

        if (data.length) {
            ({ error } = await supabaseClient
                .from("interactions")
                .update(pageState)
                .eq("page_id", page_id)
                .eq("user_id", user_id)
            );
        } else {
            ({ error } = await supabaseClient
                .from("interactions")
                .insert({ ...pageInfo, ...pageState })
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
                data: [pageState]
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