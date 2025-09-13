import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import CartIcon from '@/components/CartIcon';
import CartModal from '@/components/CartModal';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ExternalLink, Check, User, AlertCircle, Plus, LogOut, Play } from 'lucide-react';
import LicenseModal from '@/components/LicenseModal';

interface Creator {
  id: string;
  name: string;
  avatar_url: string;
  bio?: string;
  tags: string[];
  restrictions: string[];
  social_media_connected: boolean;
  social_media_type: string;
  contract_signed: boolean;
}

interface MediaItem {
  id: string;
  title?: string;
  caption?: string;
  media_type: 'image' | 'video';
  thumbnail_url: string;
  full_url: string;
  license_price: number;
  dimensions?: { width: number; height: number };
  duration?: number;
}

const CreatorGallery = () => {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch creator and media data from database
  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!id) return;

      try {
        // Fetch creator profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .eq('role', 'creator')
          .single();

        if (profileError) {
          console.error('Error fetching creator:', profileError);
          setLoading(false);
          return;
        }

        // Fetch creator's media items
        const { data: media, error: mediaError } = await supabase
          .from('media_items')
          .select('*')
          .eq('creator_id', id)
          .eq('is_available', true)
          .order('created_at', { ascending: false });

        if (mediaError) {
          console.error('Error fetching media:', mediaError);
        }

        setCreator({
          id: profile.id,
          name: profile.name,
          avatar_url: profile.avatar_url || '',
          bio: profile.bio,
          tags: profile.tags || [],
          restrictions: profile.restrictions || [],
          social_media_connected: profile.social_media_connected,
          social_media_type: profile.social_media_type || 'Instagram',
          contract_signed: profile.contract_signed
        });

        setMediaItems((media || []).map(item => ({
          id: item.id,
          title: item.title || undefined,
          caption: item.caption || undefined,
          media_type: item.media_type as 'image' | 'video',
          thumbnail_url: item.thumbnail_url,
          full_url: item.full_url,
          license_price: item.license_price,
          dimensions: item.dimensions ? item.dimensions as { width: number; height: number } : undefined,
          duration: item.duration || undefined
        })));
      } catch (error) {
        console.error('Error fetching creator data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, [id]);
  
  useEffect(() => {
    const selectId = searchParams.get('select');
    if (selectId && mediaItems.some(item => item.id === selectId)) {
      setSelectedMedia([selectId]);
    }
  }, [searchParams, mediaItems]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading creator profile...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Creator not found</h1>
          <Button asChild variant="cta">
            <Link to="/buyers">Back to Catalog</Link>
          </Button>
        </div>
      </div>
    );
  }

  const toggleMediaSelection = (mediaId: string) => {
    setSelectedMedia(prev => 
      prev.includes(mediaId)
        ? prev.filter(id => id !== mediaId)
        : [...prev, mediaId]
    );
  };

  const openInstagramPost = (permalink: string) => {
    window.open(permalink, '_blank');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLicenseRequest = () => {
    if (selectedMedia.length === 0) return;
    setShowLicenseModal(true);
  };

  const handleAddToCart = async (item: MediaItem) => {
    if (creator) {
      // Convert database media item to cart format
      const cartItem = {
        id: item.id,
        thumb: item.thumbnail_url,
        caption: item.caption || item.title || '',
        permalink: item.full_url // Using full_url as permalink for now
      };
      // Create a mock creator in the old format for the cart
      const mockCreator = {
        id: creator.id,
        name: creator.name,
        avatar: creator.avatar_url,
        tags: creator.tags,
        restrictions: creator.restrictions,
        socialMediaConnected: creator.social_media_connected,
        socialMediaType: creator.social_media_type,
        contractSigned: creator.contract_signed,
        gallery: [] // Empty since we're not using this
      };
      await addToCart(cartItem, mockCreator);
    }
  };

  const selectedItems = mediaItems.filter(item => selectedMedia.includes(item.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/buyers">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Catalog
                </Link>
              </Button>
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-black font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold text-foreground">Stockless</span>
              </Link>
              <Badge variant="secondary" className="px-3 py-1">
                <User className="w-3 h-3 mr-1" />
                Buyer
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {selectedMedia.length} selected
              </span>
              <CartIcon onClick={() => setShowCartModal(true)} />
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Creator Info */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-start gap-6">
                <img
                  src={creator.avatar_url}
                  alt={creator.name}
                  className="w-20 h-20 rounded-sm object-cover shadow-sm"
                />
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold text-foreground">{creator.name}</h1>
                {creator.social_media_connected && (
                  <Badge variant="success">
                    {creator.social_media_type} Connected
                  </Badge>
                )}
              </div>

              {creator.bio && (
                <p className="text-muted-foreground mb-3">{creator.bio}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {creator.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              {creator.restrictions.length > 0 && (
                <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-sm border border-warning/20">
                  <AlertCircle className="w-4 h-4 text-warning mt-0.5" />
                  <div className="text-sm">
                    <span className="font-medium text-warning">Usage Restrictions: </span>
                    <span className="text-muted-foreground">
                      {creator.restrictions.join(', ')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-foreground">Private Gallery</h2>
          <p className="text-muted-foreground">
            Select the content you'd like to license. Click images to select, or use the checkbox in the top-left.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-32">
          {mediaItems.map((item) => (
            <Card 
              key={item.id} 
              className={`overflow-hidden cursor-pointer smooth-transition group ${
                selectedMedia.includes(item.id) 
                  ? 'ring-2 ring-primary shadow-md' 
                  : 'hover:ring-1 hover:ring-primary/50'
              }`}
              onClick={() => toggleMediaSelection(item.id)}
            >
              <div className="relative">
                <img
                  src={item.thumbnail_url}
                  alt={item.caption || item.title || ''}
                  className="w-full aspect-square object-cover transition-transform duration-200 group-hover:scale-105"
                />
                
                {/* Media Type Indicator */}
                {item.media_type === 'video' && (
                  <div className="absolute top-2 left-8 bg-black/70 p-1 rounded-sm">
                    <Play className="w-3 h-3 text-white" />
                  </div>
                )}
                
                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2">
                  <Checkbox
                    checked={selectedMedia.includes(item.id)}
                    onCheckedChange={() => toggleMediaSelection(item.id)}
                    className="bg-black/70 border-white/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary shadow-sm"
                  />
                </div>

                {/* Price Tag */}
                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-sm text-xs text-white">
                  ${item.license_price}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item);
                  }}
                  className="absolute bottom-2 right-2 bg-primary text-primary-foreground p-1.5 rounded-sm hover:bg-primary/80 smooth-transition opacity-0 group-hover:opacity-100"
                  title="Add to cart"
                >
                  <Plus className="w-3 h-3" />
                </button>

                {/* Selection Overlay */}
                {selectedMedia.includes(item.id) && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary text-white p-2 rounded-sm">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Media Info */}
              <CardContent className="p-2">
                <p className="text-xs text-muted-foreground truncate">
                  {item.title || item.caption || 'Untitled'}
                </p>
                {item.media_type === 'video' && item.duration && (
                  <p className="text-xs text-muted-foreground">
                    {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Fixed CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium text-foreground">
                {selectedMedia.length} item{selectedMedia.length !== 1 ? 's' : ''} selected
              </span>
              {selectedMedia.length > 0 && (
                <span className="text-muted-foreground ml-2">
                  from {creator.name}
                </span>
              )}
            </div>
            
            <Button
              variant="gradient-outline"
              onClick={handleLicenseRequest}
              disabled={selectedMedia.length === 0}
              className="min-w-48"
            >
              Request License for Selected
            </Button>
          </div>
        </div>
      </div>

      {/* License Modal */}
      {showLicenseModal && selectedItems.length > 0 && (
        <LicenseModal
          creator={{
            id: creator.id,
            name: creator.name,
            avatar: creator.avatar_url,
            tags: creator.tags,
            restrictions: creator.restrictions,
            socialMediaConnected: creator.social_media_connected,
            socialMediaType: creator.social_media_type,
            contractSigned: creator.contract_signed,
            gallery: []
          }}
          selectedItems={selectedItems.map(item => ({
            id: item.id,
            thumb: item.thumbnail_url,
            caption: item.caption || item.title || '',
            permalink: item.full_url
          }))}
          onClose={() => setShowLicenseModal(false)}
        />
      )}

      <CartModal isOpen={showCartModal} onClose={() => setShowCartModal(false)} />
    </div>
  );
};

export default CreatorGallery;