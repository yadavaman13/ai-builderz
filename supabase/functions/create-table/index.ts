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
    const { tableName, columns } = await req.json();
    
    if (!tableName || !columns || !Array.isArray(columns)) {
      throw new Error('Invalid table definition');
    }

    console.log('Creating table:', tableName, 'with columns:', columns);

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

    // Validate table name (alphanumeric and underscores only)
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
      throw new Error('Invalid table name. Use only letters, numbers, and underscores.');
    }

    // Build column definitions
    const columnDefs = columns.map((col: any) => {
      if (!col.name || !col.type) {
        throw new Error('Column must have name and type');
      }
      
      // Validate column name
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(col.name)) {
        throw new Error(`Invalid column name: ${col.name}`);
      }

      let def = `"${col.name}" `;
      
      // Map types to PostgreSQL types
      switch (col.type.toLowerCase()) {
        case 'text':
          def += 'TEXT';
          break;
        case 'integer':
          def += 'INTEGER';
          break;
        case 'uuid':
          def += 'UUID DEFAULT gen_random_uuid()';
          break;
        case 'timestamp':
          def += 'TIMESTAMP WITH TIME ZONE DEFAULT now()';
          break;
        case 'boolean':
          def += 'BOOLEAN';
          break;
        case 'jsonb':
          def += 'JSONB';
          break;
        default:
          def += 'TEXT';
      }
      
      if (col.primary) {
        def += ' PRIMARY KEY';
      } else if (!col.nullable) {
        def += ' NOT NULL';
      }
      
      if (col.unique && !col.primary) {
        def += ' UNIQUE';
      }
      
      return def;
    }).join(', ');

    // Create the table
    const createTableSQL = `CREATE TABLE public."${tableName}" (${columnDefs});`;
    console.log('Executing SQL:', createTableSQL);

    const { error: createError } = await supabaseAdmin.rpc('exec_sql', {
      sql: createTableSQL
    });

    if (createError) {
      console.error('Error creating table:', createError);
      throw createError;
    }

    // Enable RLS by default
    const enableRLSSQL = `ALTER TABLE public."${tableName}" ENABLE ROW LEVEL SECURITY;`;
    console.log('Enabling RLS:', enableRLSSQL);

    const { error: rlsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: enableRLSSQL
    });

    if (rlsError) {
      console.warn('Could not enable RLS:', rlsError);
      // Don't fail if RLS can't be enabled
    }

    console.log('Table created successfully:', tableName);

    return new Response(
      JSON.stringify({ success: true, tableName }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in create-table function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});