import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default async (req, context) => {
    // 1. Define the default table you want to query.
    const defaultTable = 'users'; 

    try {
        // 2. Build the query to select all columns (*) from the default table.
        const { data, error } = await supabase
            .from(defaultTable)
            .select('*');

        // 3. Handle a database error.
        if (error) {
            console.error('Supabase error:', error.message);
            return Response.json({ 
                success: false, 
                error: `Database error retrieving from ${defaultTable}: ${error.message}` 
            }, { status: 500 });
        }

        // 4. Return the retrieved data.
        return Response.json({ success: true, data });

    } catch (err) {
        // 5. Handle any unexpected errors (e.g., connection issues).
        console.error('Unexpected error:', err.message);
        return Response.json({ success: false, error: err.message }, { status: 500 });
    }
};
