-- Insert media items for each creator with proper JSON casting
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
FROM public.profiles p WHERE p.name = 'Alice Johnson' AND p.is_demo = true;