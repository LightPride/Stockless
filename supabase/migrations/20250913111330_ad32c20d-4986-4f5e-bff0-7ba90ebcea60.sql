-- Add pricing fields to profiles table
ALTER TABLE profiles 
ADD COLUMN photo_price DECIMAL(5,2) DEFAULT 3.00 CHECK (photo_price >= 0 AND photo_price <= 5.00),
ADD COLUMN video_price DECIMAL(5,2) DEFAULT 15.00 CHECK (video_price >= 0 AND video_price <= 25.00);

-- Update existing creator profiles with default prices
UPDATE profiles 
SET photo_price = 3.00, video_price = 15.00 
WHERE role = 'creator';

-- Update media items to use creator's pricing
UPDATE media_items 
SET license_price = (
  CASE 
    WHEN media_type = 'video' THEN (
      SELECT video_price FROM profiles WHERE id = media_items.creator_id
    )
    ELSE (
      SELECT photo_price FROM profiles WHERE id = media_items.creator_id
    )
  END
);