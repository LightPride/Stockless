-- Clean up duplicate Marcus Chen media items and fix the 3rd photo
DELETE FROM media_items 
WHERE creator_id = (SELECT id FROM profiles WHERE name = 'Marcus Chen')
AND created_at >= '2025-09-13 11:04:00';

-- Update the 3rd photo that might be problematic
UPDATE media_items 
SET 
  title = 'Industrial Architecture',
  caption = 'Modern industrial building with steel and glass',
  full_url = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&h=1280&fit=crop',
  thumbnail_url = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=400&fit=crop',
  license_price = 75.00
WHERE creator_id = (SELECT id FROM profiles WHERE name = 'Marcus Chen')
AND title = 'Urban Night Lights'
LIMIT 1;

-- Add video content to Alice Johnson
INSERT INTO media_items (
  creator_id,
  title,
  caption,
  media_type,
  full_url,
  thumbnail_url,
  dimensions,
  duration,
  license_price
) VALUES 
(
  (SELECT id FROM profiles WHERE name = 'Alice Johnson'),
  'Nature Timelapse',
  'Beautiful timelapse of clouds moving over mountains',
  'video',
  'https://assets.mixkit.co/videos/preview/mixkit-white-clouds-moving-in-the-sky-27491-large.mp4',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
  '{"width": 1920, "height": 1080}',
  15,
  120.00
),
(
  (SELECT id FROM profiles WHERE name = 'Alice Johnson'),
  'Mountain Sunrise',
  'Sunrise breaking over mountain peaks with dramatic clouds',
  'video',
  'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-forest-during-sunset-28342-large.mp4',
  'https://images.unsplash.com/photo-1464822759844-d150ef263c1e?w=400&h=400&fit=crop',
  '{"width": 1920, "height": 1080}',
  20,
  150.00
);

-- Add video content to Sofia Rodriguez
INSERT INTO media_items (
  creator_id,
  title,
  caption,
  media_type,
  full_url,
  thumbnail_url,
  dimensions,
  duration,
  license_price
) VALUES 
(
  (SELECT id FROM profiles WHERE name = 'Sofia Rodriguez'),
  'Portrait Session',
  'Behind the scenes of a professional portrait session',
  'video',
  'https://assets.mixkit.co/videos/preview/mixkit-young-mother-with-her-little-daughter-eating-a-marshmallow-in-nature-39765-large.mp4',
  'https://images.unsplash.com/photo-1494790108755-2616c827e6c3?w=400&h=400&fit=crop',
  '{"width": 1920, "height": 1080}',
  25,
  180.00
);

-- Add video content to Marcus Chen  
INSERT INTO media_items (
  creator_id,
  title,
  caption,
  media_type,
  full_url,
  thumbnail_url,
  dimensions,
  duration,
  license_price
) VALUES 
(
  (SELECT id FROM profiles WHERE name = 'Marcus Chen'),
  'Urban Motion',
  'Time-lapse of busy city traffic and urban life',
  'video',
  'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-huge-city-during-the-day-27561-large.mp4',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
  '{"width": 1920, "height": 1080}',
  18,
  140.00
);