-- Function to execute SQL commands (admin only)
CREATE OR REPLACE FUNCTION public.exec_sql(sql TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get table information
CREATE OR REPLACE FUNCTION public.get_table_info()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'name', t.table_name,
      'columns', t.columns,
      'row_count', t.row_count
    )
  ) INTO result
  FROM (
    SELECT 
      t.table_name,
      COALESCE(
        json_agg(
          json_build_object(
            'name', c.column_name,
            'type', c.data_type,
            'nullable', c.is_nullable = 'YES',
            'primary', c.column_name = 'id'
          ) ORDER BY c.ordinal_position
        ) FILTER (WHERE c.column_name IS NOT NULL),
        '[]'::json
      ) as columns,
      0 as row_count
    FROM information_schema.tables t
    LEFT JOIN information_schema.columns c ON t.table_name = c.table_name 
      AND t.table_schema = c.table_schema
    WHERE t.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
      AND t.table_name NOT IN ('schema_migrations', 'supabase_migrations_schema_migrations')
    GROUP BY t.table_name
  ) t;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;