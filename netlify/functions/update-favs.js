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

    const { user_id, page_id } = await request.json();

    try {
    	if ( !user_id || !page_id ) throw new Error('missing parameters');

		const { data, error: err1 } = await supabaseClient
			.from("ratings")
			.select("is_fav")
			.eq("user_id", user_id)
			.eq("page_id", page_id);

		if (err1) throw new Error(err1);

		let error;

		if (data.length) {
			({ error } = await supabaseClient
				.from("ratings")
				.update({
					is_fav: !(data[0].is_fav)
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
					is_fav: true
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
                data: { is_fav: data.length ? !data[0].is_fav : true}
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