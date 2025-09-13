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
import { mockCreators, MediaItem } from '@/data/mockData';
import { ArrowLeft, ExternalLink, Check, User, AlertCircle, Plus, LogOut } from 'lucide-react';
import LicenseModal from '@/components/LicenseModal';

const CreatorGallery = () => {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  const creator = useMemo(() => {
    return mockCreators.find(c => c.id === id);
  }, [id]);
  
  useEffect(() => {
    const selectId = searchParams.get('select');
    if (selectId && creator?.gallery.some(g => g.id === selectId)) {
      setSelectedMedia([selectId]);
    }
  }, [searchParams, creator]);

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

  const handleAddToCart = async (item: MediaItem) => {
    if (creator) {
      await addToCart(item, creator);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLicenseRequest = () => {
    if (selectedMedia.length === 0) return;
    setShowLicenseModal(true);
  };

  const selectedItems = creator.gallery.filter(item => selectedMedia.includes(item.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
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
      </header>

      {/* Creator Info */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-start gap-6">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-20 h-20 rounded-sm object-cover shadow-sm"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold text-foreground">{creator.name}</h1>
                {creator.socialMediaConnected && (
                  <Badge variant="success">
                    {creator.socialMediaType} Connected
                  </Badge>
                )}
              </div>

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
          {creator.gallery.map((item) => (
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
                  src={item.thumb}
                  alt={item.caption}
                  className="w-full aspect-square object-cover transition-transform duration-200 group-hover:scale-105"
                />
                
                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2">
                  <Checkbox
                    checked={selectedMedia.includes(item.id)}
                    onCheckedChange={() => toggleMediaSelection(item.id)}
                    className="bg-black/70 border-white/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary shadow-sm"
                  />
                </div>

                {/* Instagram Link */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openInstagramPost(item.permalink);
                  }}
                  className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-sm hover:bg-black/80 smooth-transition"
                >
                  <ExternalLink className="w-3 h-3 text-white" />
                </button>

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
      {showLicenseModal && (
        <LicenseModal
          creator={creator}
          selectedItems={selectedItems}
          onClose={() => setShowLicenseModal(false)}
        />
      )}

      <CartModal isOpen={showCartModal} onClose={() => setShowCartModal(false)} />
    </div>
  );
};

export default CreatorGallery;