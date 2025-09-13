-- Create demo creator profile for creator@example.com
-- This matches the auth user that already exists
INSERT INTO public.profiles (
  id,
  name, 
  role,
  bio,
  tags,
  restrictions,
  avatar_url,
  social_media_connected,
  social_media_type,
  contract_signed,
  photo_price,
  video_price,
  is_demo
) VALUES (
  'd0cf2cd2-e13e-4480-a456-853b3377c1c2',
  'Demo Creator',
  'creator',
  'Demo creator account for testing the platform. Specializes in nature and urban photography.',
  ARRAY['Nature', 'Urban', 'Photography', 'Video'],
  ARRAY['Credit required', 'No commercial use without permission'],
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  true,
  'Instagram',
  true,
  3.00,
  15.00,
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  bio = EXCLUDED.bio,
  tags = EXCLUDED.tags,
  restrictions = EXCLUDED.restrictions,
  avatar_url = EXCLUDED.avatar_url,
  social_media_connected = EXCLUDED.social_media_connected,
  social_media_type = EXCLUDED.social_media_type,
  contract_signed = EXCLUDED.contract_signed,
  photo_price = EXCLUDED.photo_price,
  video_price = EXCLUDED.video_price,
  is_demo = EXCLUDED.is_demo;