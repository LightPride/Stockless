-- Create profiles table for users
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'creator')),
  bio TEXT,
  tags TEXT[],
  restrictions TEXT[],
  social_media_connected BOOLEAN DEFAULT FALSE,
  social_media_type TEXT DEFAULT 'Instagram',
  contract_signed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create media_items table for creator content
CREATE TABLE public.media_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  caption TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  thumbnail_url TEXT NOT NULL,
  full_url TEXT NOT NULL,
  file_size INTEGER,
  dimensions JSONB, -- {width: number, height: number}
  duration INTEGER, -- for videos, in seconds
  license_price DECIMAL(10,2) DEFAULT 50.00,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on media_items
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- Create policies for media_items
CREATE POLICY "Anyone can view available media items" 
ON public.media_items 
FOR SELECT 
USING (is_available = true);

CREATE POLICY "Creators can manage their own media items" 
ON public.media_items 
FOR ALL 
USING (creator_id = auth.uid());

-- Create storage buckets for media files
INSERT INTO storage.buckets (id, name, public) VALUES 
('creator-media', 'creator-media', true),
('profile-avatars', 'profile-avatars', true);

-- Create storage policies for creator media
CREATE POLICY "Anyone can view creator media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'creator-media');

CREATE POLICY "Creators can upload their own media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'creator-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Creators can update their own media" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'creator-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Creators can delete their own media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'creator-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for profile avatars
CREATE POLICY "Anyone can view profile avatars" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profile-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer'),
    'https://zgkqhmbhbxtpzwsvrted.supabase.co/storage/v1/object/public/profile-avatars/default-avatar.png'
  );
  RETURN NEW;
END;
$$;

-- Create trigger to handle new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_media_items_updated_at
  BEFORE UPDATE ON public.media_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();