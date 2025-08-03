-- Add prize fields to properties table
ALTER TABLE properties 
ADD COLUMN prize_title TEXT,
ADD COLUMN prize_description TEXT,
ADD COLUMN prize_image_url TEXT;

-- Update the Supabase storage policy for prize images (if using Supabase storage)
-- This creates a bucket for prize images that can be publicly read
INSERT INTO storage.buckets (id, name, public) 
VALUES ('prize-images', 'prize-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow anyone to view prize images
CREATE POLICY "Prize images are publicly viewable" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'prize-images');

-- Policy to allow service role to upload prize images
CREATE POLICY "Prize images can be uploaded by service role" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'prize-images');

-- Policy to allow service role to update prize images
CREATE POLICY "Prize images can be updated by service role" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'prize-images');

-- Policy to allow service role to delete prize images
CREATE POLICY "Prize images can be deleted by service role" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'prize-images');