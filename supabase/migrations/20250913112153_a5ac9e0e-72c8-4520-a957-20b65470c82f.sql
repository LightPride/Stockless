-- Update video URLs with working nature videos
UPDATE media_items 
SET 
  full_url = CASE 
    WHEN title = 'Nature Timelapse' THEN 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    WHEN title = 'Mountain Sunrise' THEN 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    WHEN title = 'Portrait Session' THEN 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    WHEN title = 'Urban Motion' THEN 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    ELSE full_url
  END,
  thumbnail_url = CASE 
    WHEN title = 'Nature Timelapse' THEN 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'
    WHEN title = 'Mountain Sunrise' THEN 'https://images.unsplash.com/photo-1464822759844-d150ef263c1e?w=400&h=400&fit=crop'
    WHEN title = 'Portrait Session' THEN 'https://images.unsplash.com/photo-1494790108755-2616c827e6c3?w=400&h=400&fit=crop'
    WHEN title = 'Urban Motion' THEN 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop'
    ELSE thumbnail_url
  END
WHERE media_type = 'video';