-- Insert media items for each creator with proper JSONB casting
-- First, insert media for Alice Johnson (Nature photographer)
INSERT INTO public.media_items (creator_id, title, caption, media_type, thumbnail_url, full_url, dimensions, license_price)
SELECT p.id, 'Mountain Sunrise', 'Beautiful sunrise over mountain peaks with golden light', 'image', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 75.00
FROM public.profiles p WHERE p.name = 'Alice Johnson' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Forest Trail', 'Misty forest trail in early morning light', 'image', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 60.00
FROM public.profiles p WHERE p.name = 'Alice Johnson' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Wildlife Eagle', 'Majestic eagle soaring in natural habitat', 'image', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 90.00
FROM public.profiles p WHERE p.name = 'Alice Johnson' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Ocean Waves', 'Powerful ocean waves crashing on rocks', 'image', 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 85.00
FROM public.profiles p WHERE p.name = 'Alice Johnson' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Mountain Lake', 'Crystal clear mountain lake with perfect reflections', 'image', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 65.00
FROM public.profiles p WHERE p.name = 'Alice Johnson' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Waterfall Paradise', 'Tropical waterfall surrounded by lush greenery', 'image', 'https://images.unsplash.com/photo-1432889490240-84df33d47091?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1432889490240-84df33d47091?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 70.00
FROM public.profiles p WHERE p.name = 'Alice Johnson' AND p.is_demo = true

-- Insert media for Marcus Chen (Urban photographer)  
UNION ALL
SELECT p.id, 'City Skyline', 'Modern city skyline at golden hour', 'image', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 80.00
FROM public.profiles p WHERE p.name = 'Marcus Chen' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Street Art Mural', 'Vibrant street art mural in urban setting', 'image', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 55.00
FROM public.profiles p WHERE p.name = 'Marcus Chen' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Urban Night Lights', 'City lights and traffic trails at night', 'image', 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 85.00
FROM public.profiles p WHERE p.name = 'Marcus Chen' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Modern Architecture', 'Geometric patterns in modern building design', 'image', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 70.00
FROM public.profiles p WHERE p.name = 'Marcus Chen' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Subway Station', 'Underground subway station with motion blur', 'image', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 65.00
FROM public.profiles p WHERE p.name = 'Marcus Chen' AND p.is_demo = true

-- Insert media for Sofia Rodriguez (Travel/Lifestyle)
UNION ALL
SELECT p.id, 'Tropical Beach', 'Paradise beach with crystal clear turquoise waters', 'image', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 70.00
FROM public.profiles p WHERE p.name = 'Sofia Rodriguez' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Café Culture', 'Cozy café setting with artisan coffee and pastries', 'image', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 45.00
FROM public.profiles p WHERE p.name = 'Sofia Rodriguez' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Gourmet Food Styling', 'Beautiful gourmet food presentation', 'image', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 50.00
FROM public.profiles p WHERE p.name = 'Sofia Rodriguez' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Travel Adventure', 'Hiking adventure in scenic mountain landscape', 'image', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 75.00
FROM public.profiles p WHERE p.name = 'Sofia Rodriguez' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Golden Hour City', 'City skyline during magical golden hour', 'image', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 65.00
FROM public.profiles p WHERE p.name = 'Sofia Rodriguez' AND p.is_demo = true

-- Insert media for James Wilson (Fashion/Portrait)
UNION ALL
SELECT p.id, 'Fashion Portrait', 'Professional fashion portrait with dramatic lighting', 'image', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 120.00
FROM public.profiles p WHERE p.name = 'James Wilson' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Editorial Shoot', 'High-fashion editorial style photography', 'image', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 150.00
FROM public.profiles p WHERE p.name = 'James Wilson' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Street Style', 'Casual street style fashion photography', 'image', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 90.00
FROM public.profiles p WHERE p.name = 'James Wilson' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Studio Portrait', 'Professional studio portrait with perfect lighting', 'image', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 110.00
FROM public.profiles p WHERE p.name = 'James Wilson' AND p.is_demo = true

-- Insert media for Emma Thompson (Wellness/Lifestyle)
UNION ALL
SELECT p.id, 'Yoga Serenity', 'Peaceful yoga practice in natural setting', 'image', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 55.00
FROM public.profiles p WHERE p.name = 'Emma Thompson' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Mindful Morning', 'Morning meditation and wellness routine', 'image', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 60.00
FROM public.profiles p WHERE p.name = 'Emma Thompson' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Healthy Lifestyle', 'Fresh organic ingredients for healthy living', 'image', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 50.00
FROM public.profiles p WHERE p.name = 'Emma Thompson' AND p.is_demo = true
UNION ALL
SELECT p.id, 'Nature Meditation', 'Peaceful meditation in beautiful natural environment', 'image', 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&h=400&fit=crop', 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1920&h=1280&fit=crop', '{"width": 1920, "height": 1280}'::jsonb, 65.00
FROM public.profiles p WHERE p.name = 'Emma Thompson' AND p.is_demo = true;