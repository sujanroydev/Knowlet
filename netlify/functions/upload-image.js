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
        const name = formData.get("name");     // normal field

        if (!image) {
            return new Response(
                JSON.stringify({ success: false, error: "Image required" }),
                { status: 400 }
            );
        }

        const fileExt = image.name.split(".").pop();
        const filePath = `users/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabaseClient
            .storage
            .from("images")
            .upload(filePath, image, {
                contentType: image.type
            });

        if (uploadError) {
            return new Response(
                JSON.stringify({ success: false, error: uploadError.message }),
                { status: 500 }
            );
        }

        // Optional: store image path in table
        const { error: dbError } = await supabaseClient
            .from("user")
            .insert({
                name,
                image_path: filePath
            });

        if (dbError) {
            return new Response(
                JSON.stringify({ success: false, error: dbError.message }),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, path: filePath }),
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