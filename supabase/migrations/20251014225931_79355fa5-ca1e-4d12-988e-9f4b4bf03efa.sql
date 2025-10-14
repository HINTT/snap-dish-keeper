-- Add sharing fields to recipes table
ALTER TABLE public.recipes 
ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN share_token TEXT UNIQUE;

-- Create index on share_token for faster lookups
CREATE INDEX idx_recipes_share_token ON public.recipes(share_token);

-- Create policy for public viewing of shared recipes
CREATE POLICY "Anyone can view shared recipes" 
ON public.recipes 
FOR SELECT 
USING (is_public = true AND share_token IS NOT NULL);

-- Function to generate share token
CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'hex');
END;
$$ LANGUAGE plpgsql;