-- Update all videos with reliable nature content
UPDATE media_items 
SET 
  full_url = CASE 
    WHEN creator_id = (SELECT id FROM profiles WHERE name = 'Alice Johnson' LIMIT 1) AND media_type = 'video' AND title LIKE '%Forest%' THEN 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    WHEN creator_id = (SELECT id FROM profiles WHERE name = 'Alice Johnson' LIMIT 1) AND media_type = 'video' AND title LIKE '%Ocean%' THEN 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    WHEN creator_id = (SELECT id FROM profiles WHERE name = 'Sofia Rodriguez' LIMIT 1) AND media_type = 'video' THEN 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    WHEN creator_id = (SELECT id FROM profiles WHERE name = 'Marcus Chen' LIMIT 1) AND media_type = 'video' THEN 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    ELSE full_url
  END,
  title = CASE 
    WHEN creator_id = (SELECT id FROM profiles WHERE name = 'Alice Johnson' LIMIT 1) AND media_type = 'video' AND title LIKE '%Forest%' THEN 'Peaceful Forest'
    WHEN creator_id = (SELECT id FROM profiles WHERE name = 'Alice Johnson' LIMIT 1) AND media_type = 'video' AND title LIKE '%Ocean%' THEN 'Ocean Sunrise'
    WHEN creator_id = (SELECT id FROM profiles WHERE name = 'Sofia Rodriguez' LIMIT 1) AND media_type = 'video' THEN 'Mountain Lake'
    WHEN creator_id = (SELECT id FROM profiles WHERE name = 'Marcus Chen' LIMIT 1) AND media_type = 'video' THEN 'Desert Landscape'
    ELSE title
  END,
  caption = CASE 
    WHEN creator_id = (SELECT id FROM profiles WHERE name = 'Alice Johnson' LIMIT 1) AND media_type = 'video' AND title = 'Peaceful Forest' THEN 'Serene forest scenes with gentle wildlife'
    WHEN creator_id = (SELECT id FROM profiles WHERE name = 'Alice Johnson' LIMIT 1) AND media_type = 'video' AND title = 'Ocean Sunrise' THEN 'Beautiful sunrise over calm ocean waters'
    WHEN creator_id = (SELECT id FROM profiles WHERE name = 'Sofia Rodriguez' LIMIT 1) AND media_type = 'video' THEN 'Crystal clear mountain lake surrounded by peaks'
    WHEN creator_id = (SELECT id FROM profiles WHERE name = 'Marcus Chen' LIMIT 1) AND media_type = 'video' THEN 'Vast desert landscape with dramatic rock formations'
    ELSE caption
  END,
  thumbnail_url = CASE 
    WHEN creator_id = (SELECT id FROM profiles WHERE name = 'Alice Johnson' LIMIT 1) AND media_type = 'video' AND title = 'Peaceful Forest' THEN 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop'
    WHEN creator_id = (SELECT id FROM profiles WHERE name = 'Alice Johnson' LIMIT 1) AND media_type = 'video' AND title = 'Ocean Sunrise' THEN 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'
    WHEN creator_id = (SELECT id FROM profiles WHERE name = 'Sofia Rodriguez' LIMIT 1) AND media_type = 'video' THEN 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'
    WHEN creator_id = (SELECT id FROM profiles WHERE name = 'Marcus Chen' LIMIT 1) AND media_type = 'video' THEN 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop'
    ELSE thumbnail_url
  END
WHERE media_type = 'video';