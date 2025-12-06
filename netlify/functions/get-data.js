import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default async (req, context) => {
    try {
        // Example: Read query params
        const table = req.query.table || 'users';
        const column = req.query.column;
        const value = req.query.value;

        let query = supabase.from(table).select('*');

        if (column && value) {
            query = query.eq(column, value);
        }

        const { data, error } = await query;

        if (error) {
            return Response.json({ success: false, error: error.message }, { status: 500 });
        }

        return Response.json({ success: true, data });
    } catch (err) {
        return Response.json({ success: false, error: err.message }, { status: 500 });
    }
};