import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Camera, Instagram, LogOut, Plus, X, Euro, DollarSign, Upload, CheckCircle, AlertTriangle } from 'lucide-react';

const CreatorDashboard = () => {
  const { user, logout } = useAuth();
  const [creator, setCreator] = useState<any>(null);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    tags: [] as string[],
    restrictions: [] as string[],
    photo_price: 3.00,
    video_price: 15.00,
  });
  const [newTag, setNewTag] = useState('');
  const [newRestriction, setNewRestriction] = useState('');

  // Fetch creator data and media items
  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!user) return;
      
      try {
        // Fetch creator profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching creator profile:', profileError);
          return;
        }

        setCreator(profile);
        setEditedProfile({
          name: profile.name || '',
          tags: profile.tags || [],
          restrictions: profile.restrictions || [],
          photo_price: profile.photo_price || 3.00,
          video_price: profile.video_price || 15.00,
        });

        // Fetch media items
        const { data: media, error: mediaError } = await supabase
          .from('media_items')
          .select('*')
          .eq('creator_id', user.id)
          .eq('is_available', true);

        if (mediaError) {
          console.error('Error fetching media items:', mediaError);
          return;
        }

        setMediaItems(media || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editedProfile.name,
          tags: editedProfile.tags,
          restrictions: editedProfile.restrictions,
          photo_price: editedProfile.photo_price,
          video_price: editedProfile.video_price,
        })
        .eq('id', user?.id);

      if (error) {
        console.error('Error updating profile:', error);
        return;
      }

      // Update media items pricing
      await Promise.all([
        supabase
          .from('media_items')
          .update({ license_price: editedProfile.photo_price })
          .eq('creator_id', user?.id)
          .eq('media_type', 'image'),
        supabase
          .from('media_items')
          .update({ license_price: editedProfile.video_price })
          .eq('creator_id', user?.id)
          .eq('media_type', 'video')
      ]);

      setCreator(prev => ({
        ...prev,
        name: editedProfile.name,
        tags: editedProfile.tags,
        restrictions: editedProfile.restrictions,
        photo_price: editedProfile.photo_price,
        video_price: editedProfile.video_price,
      }));
      setIsEditing(false);
      
      // Refetch media items to show updated prices
      const { data: media } = await supabase
        .from('media_items')
        .select('*')
        .eq('creator_id', user?.id)
        .eq('is_available', true);
      setMediaItems(media || []);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile({
      name: creator.name,
      tags: [...(creator.tags || [])],
      restrictions: [...(creator.restrictions || [])],
      photo_price: creator.photo_price || 3.00,
      video_price: creator.video_price || 15.00,
    });
    setIsEditing(false);
  };

  const addTag = () => {
    if (newTag.trim() && !editedProfile.tags.includes(newTag.trim())) {
      setEditedProfile(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedProfile(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addRestriction = () => {
    if (newRestriction.trim() && !editedProfile.restrictions.includes(newRestriction.trim())) {
      setEditedProfile(prev => ({
        ...prev,
        restrictions: [...prev.restrictions, newRestriction.trim()]
      }));
      setNewRestriction('');
    }
  };

  const removeRestriction = (restrictionToRemove: string) => {
    setEditedProfile(prev => ({
      ...prev,
      restrictions: prev.restrictions.filter(restriction => restriction !== restrictionToRemove)
    }));
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Creator profile not found</h2>
          <p className="text-muted-foreground">Please contact support if this issue persists.</p>
        </div>
      </div>
    );
  }

  const photoItems = mediaItems.filter(item => item.media_type === 'image');
  const videoItems = mediaItems.filter(item => item.media_type === 'video');

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold">Stockless</span>
              </Link>
              <Badge variant="secondary" className="px-3 py-1">
                <Camera className="w-3 h-3 mr-1" />
                Creator
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.name}
              </span>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your profile, set your prices, and track your content.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Management */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Profile Settings</CardTitle>
                  {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                      <Button variant="default" onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={creator.avatar_url || '/default-avatar.png'}
                    alt={creator.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{creator.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {mediaItems.length} items in gallery
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="name">Creator Name</Label>
                  <Input
                    id="name"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                {/* Pricing Section */}
                <div className="space-y-4 p-4 bg-muted/20 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <Label className="font-semibold">Content Pricing</Label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="photo_price">Photo Price (€)</Label>
                      <Input
                        id="photo_price"
                        type="number"
                        min="0"
                        max="5"
                        step="0.50"
                        value={editedProfile.photo_price}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, photo_price: parseFloat(e.target.value) || 0 }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Max €5.00</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="video_price">Video Price (€)</Label>
                      <Input
                        id="video_price"
                        type="number"
                        min="0"
                        max="25"
                        step="1"
                        value={editedProfile.video_price}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, video_price: parseFloat(e.target.value) || 0 }))}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Max €25.00</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    All your photos will be priced at €{editedProfile.photo_price.toFixed(2)} and videos at €{editedProfile.video_price.toFixed(2)}
                  </div>
                </div>

                <div>
                  <Label>Content Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editedProfile.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                        {isEditing && (
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add new tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <Button variant="outline" size="sm" onClick={addTag}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Usage Restrictions</Label>
                  <div className="space-y-2 mb-2">
                    {editedProfile.restrictions.map((restriction) => (
                      <div key={restriction} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                        <span>{restriction}</span>
                        {isEditing && (
                          <button
                            onClick={() => removeRestriction(restriction)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add new restriction"
                        value={newRestriction}
                        onChange={(e) => setNewRestriction(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addRestriction()}
                      />
                      <Button variant="outline" size="sm" onClick={addRestriction}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Social Media Connection */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle>Social Media Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Instagram className="w-6 h-6 text-pink-500" />
                    <div>
                      <p className="font-medium">Instagram</p>
                      <p className="text-sm text-muted-foreground">
                        {creator.social_media_connected ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  {creator.social_media_connected ? (
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Not Connected
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Gallery Preview */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle>Content Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded">
                  <div>
                    <p className="text-sm text-muted-foreground">Photos</p>
                    <p className="text-2xl font-bold">{photoItems.length}</p>
                    <p className="text-xs text-muted-foreground">€{creator.photo_price?.toFixed(2)} each</p>
                  </div>
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded">
                  <div>
                    <p className="text-sm text-muted-foreground">Videos</p>
                    <p className="text-2xl font-bold">{videoItems.length}</p>
                    <p className="text-xs text-muted-foreground">€{creator.video_price?.toFixed(2)} each</p>
                  </div>
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Gallery Preview */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle>Gallery Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {mediaItems.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {mediaItems.slice(0, 9).map((item) => (
                      <div key={item.id} className="relative aspect-square">
                        {item.media_type === 'video' ? (
                          <video
                            src={item.full_url}
                            className="w-full h-full object-cover rounded border"
                            muted
                            loop
                          />
                        ) : (
                          <img
                            src={item.thumbnail_url}
                            alt={item.title || item.caption}
                            className="w-full h-full object-cover rounded border"
                          />
                        )}
                        <div className="absolute bottom-1 right-1 bg-black/70 px-1 py-0.5 rounded text-xs text-white">
                          €{item.license_price}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No content yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect your Instagram to sync your content.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatorDashboard;