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
  sofia_id, 'Sofia Rodriguez', 'creator', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Travel and lifestyle content creator', ARRAY['Travel', 'Lifestyle', 'Food'], ARRAY[]::text[], true, true
FROM creator_uuids;