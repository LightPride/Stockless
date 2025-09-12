import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { mockCreators, MediaItem } from '@/data/mockData';
import { ArrowLeft, ExternalLink, ShoppingCart, User, AlertCircle } from 'lucide-react';
import LicenseModal from '@/components/LicenseModal';

const CreatorGallery = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  const creator = useMemo(() => {
    return mockCreators.find(c => c.id === id);
  }, [id]);

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

  const handleLicenseRequest = () => {
    if (selectedMedia.length === 0) return;
    setShowLicenseModal(true);
  };

  const selectedItems = creator.gallery.filter(item => selectedMedia.includes(item.id));

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40 shadow-soft">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/buyers">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Catalog
                </Link>
              </Button>
              <Badge variant="secondary" className="px-3 py-1">
                <User className="w-3 h-3 mr-1" />
                Buyer
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {selectedMedia.length} selected
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Creator Info (Fixed) */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-start gap-6">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-20 h-20 rounded-full object-cover shadow-medium"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold">{creator.name}</h1>
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
                <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg border border-warning/20">
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

      {/* Gallery (Scrollable) */}
      <section className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Private Gallery</h2>
          <p className="text-muted-foreground">
            Select the content you'd like to license. Click images to select, or use the checkbox in the top-left.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          {creator.gallery.map((item) => (
            <Card 
              key={item.id} 
              className={`overflow-hidden cursor-pointer smooth-transition border-2 ${
                selectedMedia.includes(item.id) 
                  ? 'border-primary shadow-medium ring-2 ring-primary/20' 
                  : 'border-transparent hover:border-primary/30'
              }`}
              onClick={() => toggleMediaSelection(item.id)}
            >
              <div className="relative">
                <img
                  src={item.thumb}
                  alt={item.caption}
                  className="w-full h-64 object-cover"
                />
                
                {/* Selection Checkbox */}
                <div className="absolute top-3 left-3">
                  <Checkbox
                    checked={selectedMedia.includes(item.id)}
                    onCheckedChange={() => toggleMediaSelection(item.id)}
                    className="bg-white/90 border-white shadow-medium"
                  />
                </div>

                {/* Instagram Link */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openInstagramPost(item.permalink);
                  }}
                  className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white smooth-transition shadow-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>

                {/* Selection Overlay */}
                {selectedMedia.includes(item.id) && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary text-white p-2 rounded-full">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground truncate">
                  {item.caption}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Fixed CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-large z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">
                {selectedMedia.length} item{selectedMedia.length !== 1 ? 's' : ''} selected
              </span>
              {selectedMedia.length > 0 && (
                <span className="text-muted-foreground ml-2">
                  from {creator.name}
                </span>
              )}
            </div>
            
            <Button
              variant="cta"
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
    </div>
  );
};

export default CreatorGallery;