import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('Fetching database schema...');

    // Query to get table information
    const { data: tables, error: tablesError } = await supabaseAdmin
      .rpc('get_table_info');

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      // Fallback: try to get basic table info from our known tables
      const { data: profiles } = await supabaseAdmin.from('profiles').select('*').limit(0);
      const { data: projects } = await supabaseAdmin.from('projects').select('*').limit(0);
      
      const fallbackTables = [
        {
          name: 'profiles',
          columns: [
            { name: 'id', type: 'uuid', nullable: false, primary: true },
            { name: 'user_id', type: 'uuid', nullable: false, primary: false },
            { name: 'email', type: 'text', nullable: true, primary: false },
            { name: 'full_name', type: 'text', nullable: true, primary: false },
            { name: 'created_at', type: 'timestamptz', nullable: false, primary: false },
            { name: 'updated_at', type: 'timestamptz', nullable: false, primary: false }
          ],
          row_count: 0
        },
        {
          name: 'projects',
          columns: [
            { name: 'id', type: 'uuid', nullable: false, primary: true },
            { name: 'user_id', type: 'uuid', nullable: false, primary: false },
            { name: 'name', type: 'text', nullable: false, primary: false },
            { name: 'description', type: 'text', nullable: true, primary: false },
            { name: 'project_data', type: 'jsonb', nullable: true, primary: false },
            { name: 'created_at', type: 'timestamptz', nullable: false, primary: false },
            { name: 'updated_at', type: 'timestamptz', nullable: false, primary: false }
          ],
          row_count: 0
        }
      ];

      return new Response(
        JSON.stringify({ tables: fallbackTables }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Schema fetched successfully:', tables);

    return new Response(
      JSON.stringify({ tables: tables || [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in get-schema function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        tables: [] // Return empty array as fallback
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});