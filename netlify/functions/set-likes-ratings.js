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
    
    const { pageId, userId, action, pageLiked, pageRatingsScore, pageReview } = await request.json();
    const allowedActions = ["like", "rate"];

    try {
        if (!pageId || !userId) throw new Error('PageId and userId are required');
        if (!allowedActions.includes(action)) {
            return new Response("Invalid action", { status: 400 });
        }

        if (action === 'like') {
            const { error } = await supabaseClient
                .from('ratings')
                .insert({
                    page_id: pageId,
                    user_id: userId,
                    page_likes: 1
                })
                
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
            
        }
        if (action === 'rate') {
            const { error } = await supabaseClient
                .from('ratings')
                .insert({
                    page_id: pageId,
                    user_id: userId,
                    page_ratings: pageRatingsScore,
                    ratings_message: pageReview
                })
                
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
            
        }
        
        return new Response(
            JSON.stringify({
                success: true
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