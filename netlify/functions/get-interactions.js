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
    const action = searchParams.get('action'); // likes, ratings, favs and all

    const { page_id, user_id } = await request.json();

    try {
        if (!user_id && !page_id) throw new Error('must give user id or page id');

        let data, error;

        if (action === 'likes') {
            if (user_id && page_id) {
                ({ data, error } = await supabaseClient
                    .from('ratings')
                    .select('page_likes, interactions_time')
                    .eq('user_id', user_id)
                    .eq('page_id', page_id)
                );
            }
            else if(user_id && !page_id) {
                ({ data, error } = await supabaseClient
                    .from('ratings')
                    .select('page_id, page_title, interactions_time')
                    .eq('user_id', user_id)
                    .gt('page_likes', 0)
                );
            }
            else if(page_id && !user_id) {
                ({ data, error } = await supabaseClient
                    .from('ratings')
                    .select('user_id, interactions_time, user (name, picture)')
                    .eq('page_id', page_id)
                    .gt('page_likes', 0)
                );
            }
        }
        else if (action === 'ratings') {
            if (user_id && page_id) {
                ({ data, error } = await supabaseClient
                    .from('ratings')
                    .select('page_ratings, ratings_message, interactions_time')
                    .eq('user_id', user_id)
                    .eq('page_id', page_id)
                );
            }
            else if(user_id && !page_id) {
                ({ data, error } = await supabaseClient
                    .from('ratings')
                    .select('page_id, page_title, page_ratings, ratings_message, interactions_time')
                    .eq('user_id', user_id)
                    .gt('page_ratings', 0)
                );
            }
            else if(page_id && !user_id) {
                ({ data, error } = await supabaseClient
                    .from('ratings')
                    .select('user_id, page_ratings, ratings_message, interactions_time, user (name, picture)')
                    .eq('page_id', page_id)
                    .gt('page_ratings', 0)
                );
            }
        }
        else if (action === 'favs') {
            if (user_id && page_id) {
                ({ data, error } = await supabaseClient
                    .from('ratings')
                    .select('is_fav, interactions_time')
                    .eq('user_id', user_id)
                    .eq('page_id', page_id)
                );
            }
            else if(user_id && !page_id) {
                ({ data, error } = await supabaseClient
                    .from('ratings')
                    .select('page_id, page_title, interactions_time')
                    .eq('user_id', user_id)
                    .eq('is_fav', true)
                );
            }
            else if(page_id && !user_id) throw new Error(`cann't access favs without user_id.`);
        }
        else if (!action) {
            if (user_id && page_id) {
                ({ data, error } = await supabaseClient
                    .from('ratings')
                    .select('page_likes, page_ratings, ratings_message, is_fav, interactions_time')
                    .eq('user_id', user_id)
                    .eq('page_id', page_id)
                );
            }
            else if (user_id && !page_id) {
                ({ data, error } = await supabaseClient
                    .from('ratings')
                    .select('user_id, page_title, page_likes, page_ratings, ratings_message, is_fav, interactions_time')
                    .eq('user_id', user_id)
                );
            }
            else if (page_id && !user_id) {
                ({ data, error } = await supabaseClient
                    .from('ratings')
                    .select('page_id, page_title, page_likes, page_ratings, ratings_message, interactions_time')
                    .eq('user_id', user_id)
                );
            }
        }
        else throw new Error(`Invald action.`);

        if (error) {
            return new Response(
                JSON.stringify({ success: false, error: error.message }),
                { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, data }),
            { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );

    } catch (err) {
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
    }
};
