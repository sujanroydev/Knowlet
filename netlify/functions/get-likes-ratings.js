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
    
    const { pageId, userId } = await request.json();
    
    try {
    	
    	let data, error;
    	if (userId && pageId) {
			({ data, error } = await supabaseClient
	            .from('ratings')
	            .select('*')
	            .eq('page_id', pageId)
	            .eq('user_id', userId)
	        );
    	} else if(!userId && pageId) {
    		({ data, error } = await supabaseClient
	            .from('ratings')
	            .select('id, page_ratings, page_likes, ratings_message, created_at, user (id, name, picture)')
	            .eq('page_id', pageId)
	            .order("created_at", { ascending: false })
	        );
    	} else if(!pageId && userId) {
    		({ data, error } = await supabaseClient
	            .from('ratings')
	            .select('id, page_ratings, page_likes, created_at')
	            .eq('user_id', userId)
	        );
    	} else {
    		throw new Error('invalid pageId or userId');
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