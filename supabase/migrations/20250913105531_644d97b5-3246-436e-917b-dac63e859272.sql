-- Generate UUIDs for sample creators and insert sample creator profiles
WITH creator_uuids AS (
  SELECT 
    gen_random_uuid() AS alice_id,
    gen_random_uuid() AS marcus_id,
    gen_random_uuid() AS sofia_id
)
INSERT INTO public.profiles (id, name, role, avatar_url, bio, tags, restrictions, social_media_connected, contract_signed)
SELECT 
  alice_id, 'Alice Johnson', 'creator', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'Professional photographer specializing in nature and wildlife', ARRAY['Nature', 'Wildlife', 'Landscapes'], ARRAY['No commercial use without attribution'], true, true
FROM creator_uuids
UNION ALL
SELECT 
  marcus_id, 'Marcus Chen', 'creator', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Urban photographer and videographer', ARRAY['Urban', 'Street', 'Architecture'], ARRAY['No resale', 'Credit required'], true, true
FROM creator_uuids
UNION ALL
SELECT 
  sofia_id, 'Sofia Rodriguez', 'creator', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Travel and lifestyle content creator', ARRAY['Travel', 'Lifestyle', 'Food'], ARRAY[], true, true
FROM creator_uuids;

-- Insert sample media items using actual creator IDs from the profiles table
INSERT INTO public.media_items (creator_id, title, caption, media_type, thumbnail_url, full_url, dimensions, license_price)
SELECT 
  p.id, 'Mountain Sunrise', 'Beautiful sunrise over mountain peaks', 'image', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}', 75.00
FROM public.profiles p WHERE p.name = 'Alice Johnson'
UNION ALL
SELECT 
  p.id, 'Forest Trail', 'Misty forest trail in early morning', 'image', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}', 60.00
FROM public.profiles p WHERE p.name = 'Alice Johnson'
UNION ALL
SELECT 
  p.id, 'Wildlife Eagle', 'Majestic eagle in natural habitat', 'image', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}', 90.00
FROM public.profiles p WHERE p.name = 'Alice Johnson'
UNION ALL
SELECT 
  p.id, 'Ocean Waves', 'Time-lapse of ocean waves crashing', 'video', 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=400&fit=crop', 'https://player.vimeo.com/external/sample-video.mp4', '{"width": 1920, "height": 1080}', 120.00
FROM public.profiles p WHERE p.name = 'Alice Johnson'
UNION ALL
SELECT 
  p.id, 'Mountain Lake', 'Crystal clear mountain lake reflection', 'image', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}', 65.00
FROM public.profiles p WHERE p.name = 'Alice Johnson'
UNION ALL
SELECT 
  p.id, 'City Skyline', 'Modern city skyline at golden hour', 'image', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}', 80.00
FROM public.profiles p WHERE p.name = 'Marcus Chen'
UNION ALL
SELECT 
  p.id, 'Street Art', 'Vibrant street art in urban setting', 'image', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}', 55.00
FROM public.profiles p WHERE p.name = 'Marcus Chen'
UNION ALL
SELECT 
  p.id, 'Urban Night', 'City lights and traffic trails', 'image', 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}', 85.00
FROM public.profiles p WHERE p.name = 'Marcus Chen'
UNION ALL
SELECT 
  p.id, 'City Walk', 'Urban exploration timelapse', 'video', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=400&fit=crop', 'https://player.vimeo.com/external/urban-walk.mp4', '{"width": 1920, "height": 1080}', 100.00
FROM public.profiles p WHERE p.name = 'Marcus Chen'
UNION ALL
SELECT 
  p.id, 'Architecture', 'Modern building geometric patterns', 'image', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}', 70.00
FROM public.profiles p WHERE p.name = 'Marcus Chen'
UNION ALL
SELECT 
  p.id, 'Tropical Beach', 'Paradise beach with crystal waters', 'image', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}', 70.00
FROM public.profiles p WHERE p.name = 'Sofia Rodriguez'
UNION ALL
SELECT 
  p.id, 'Café Culture', 'Cozy café setting with artisan coffee', 'image', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}', 45.00
FROM public.profiles p WHERE p.name = 'Sofia Rodriguez'
UNION ALL
SELECT 
  p.id, 'Food Styling', 'Beautiful food presentation', 'image', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}', 50.00
FROM public.profiles p WHERE p.name = 'Sofia Rodriguez'
UNION ALL
SELECT 
  p.id, 'Travel Vlog', 'Day in the life travel content', 'video', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop', 'https://player.vimeo.com/external/travel-vlog.mp4', '{"width": 1920, "height": 1080}', 95.00
FROM public.profiles p WHERE p.name = 'Sofia Rodriguez'
UNION ALL
SELECT 
  p.id, 'Sunset Views', 'Golden hour city views', 'image', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}', 65.00
FROM public.profiles p WHERE p.name = 'Sofia Rodriguez';