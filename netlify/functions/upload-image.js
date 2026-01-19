import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(
    process.env.SUPABASE_DATABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default async (request) => {

    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            }
        });
    }

    try {
        const formData = await request.formData();

        const image = formData.get("image");   // File object
        const filePath = formData.get("filePath");     // normal field

        if (!image) {
            return new Response(
                JSON.stringify({ success: false, error: "Image required" }),
                { status: 400 }
            );
        }

        const { error: uploadError } = await supabaseClient
            .storage
            .from("avatars")
            .upload(filePath, image, {
                cacheControl: "3600",
				upsert: true
            });

        if (uploadError) {
            return new Response(
                JSON.stringify({ success: false, error: uploadError.message }),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, publicUrl: `https://ampwczxrfpbqlkuawrdf.supabase.co/storage/v1/object/public/avatars/${filePath}` }),
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
            JSON.stringify({ success: false, error: err.message }),
            { status: 500 }
        );
    }
};