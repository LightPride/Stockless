-- Update with more reliable video URLs and better nature content
UPDATE media_items 
SET 
  full_url = CASE 
    WHEN title = 'Nature Timelapse' THEN 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4'
    WHEN title = 'Mountain Sunrise' THEN 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
    WHEN title = 'Portrait Session' THEN 'https://filesamples.com/samples/video/mp4/SampleVideo_1280x720_1mb.mp4'
    WHEN title = 'Urban Motion' THEN 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
    ELSE full_url
  END,
  title = CASE 
    WHEN title = 'Nature Timelapse' THEN 'Forest Timelapse'
    WHEN title = 'Mountain Sunrise' THEN 'Ocean Waves'
    WHEN title = 'Portrait Session' THEN 'Sunset Landscape'
    WHEN title = 'Urban Motion' THEN 'City Night Life'
    ELSE title
  END,
  caption = CASE 
    WHEN title = 'Forest Timelapse' THEN 'Beautiful forest scenes with changing light'
    WHEN title = 'Ocean Waves' THEN 'Peaceful ocean waves crashing on the shore'
    WHEN title = 'Sunset Landscape' THEN 'Golden hour landscape with vibrant colors'
    WHEN title = 'City Night Life' THEN 'Urban nighttime scenes with city lights'
    ELSE caption
  END
WHERE media_type = 'video';