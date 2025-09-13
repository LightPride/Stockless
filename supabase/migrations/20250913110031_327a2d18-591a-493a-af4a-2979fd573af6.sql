-- Make profiles table work for demo data by making the foreign key optional
-- First, drop the existing foreign key constraint
ALTER TABLE public.profiles DROP CONSTRAINT profiles_id_fkey;

-- Make id not require auth.users reference for demo creators
-- We'll add a new column to distinguish between real users and demo creators
ALTER TABLE public.profiles ADD COLUMN is_demo BOOLEAN DEFAULT FALSE;

-- Insert demo creator profiles with generated UUIDs
INSERT INTO public.profiles (id, name, role, avatar_url, bio, tags, restrictions, social_media_connected, social_media_type, contract_signed, is_demo) VALUES
(gen_random_uuid(), 'Alice Johnson', 'creator', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'Professional photographer specializing in nature and wildlife photography. I capture the beauty of the natural world through my lens.', ARRAY['Nature', 'Wildlife', 'Landscapes', 'Photography'], ARRAY['No commercial use without attribution', 'Credit required'], true, 'Instagram', true, true),
(gen_random_uuid(), 'Marcus Chen', 'creator', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Urban photographer and videographer capturing the pulse of city life. Street art, architecture, and urban culture are my passion.', ARRAY['Urban', 'Street', 'Architecture', 'Video'], ARRAY['No resale', 'Credit required'], true, 'Instagram', true, true),
(gen_random_uuid(), 'Sofia Rodriguez', 'creator', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Travel and lifestyle content creator sharing authentic moments from around the world. Food, culture, and adventure enthusiast.', ARRAY['Travel', 'Lifestyle', 'Food', 'Culture'], ARRAY[]::text[], true, 'Instagram', true, true),
(gen_random_uuid(), 'James Wilson', 'creator', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Fashion and portrait photographer with 10+ years experience. Specializing in editorial shoots and brand campaigns.', ARRAY['Fashion', 'Portraits', 'Editorial', 'Commercial'], ARRAY['Commercial license available'], true, 'Instagram', true, true),
(gen_random_uuid(), 'Emma Thompson', 'creator', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', 'Lifestyle and wellness content creator. Yoga instructor turned photographer capturing mindful living and self-care moments.', ARRAY['Wellness', 'Lifestyle', 'Yoga', 'Mindfulness'], ARRAY['Personal use only'], true, 'Instagram', true, true);