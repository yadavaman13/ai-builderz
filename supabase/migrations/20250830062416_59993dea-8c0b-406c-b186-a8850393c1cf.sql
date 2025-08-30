-- Add project_data column to store builder component data
ALTER TABLE public.projects 
ADD COLUMN project_data JSONB DEFAULT '{"components": [], "tables": []}';

-- Update existing projects to have the default structure
UPDATE public.projects 
SET project_data = '{"components": [], "tables": []}' 
WHERE project_data IS NULL;