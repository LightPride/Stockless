import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import CartIcon from '@/components/CartIcon';
import CartModal from '@/components/CartModal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, LogOut, User, Eye, ChevronDown, Play } from 'lucide-react';

interface Creator {
  id: string;
  name: string;
  avatar_url: string;
  bio?: string;
  tags: string[];
  restrictions: string[];
  social_media_connected: boolean;
  contract_signed: boolean;
  media_count?: number;
  sample_media?: Array<{
    thumbnail_url: string;
    media_type: string;
    full_url: string;
  }>;
}

const BuyerCatalog = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch creators from database
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        // Fetch creator profiles
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'creator')
          .eq('social_media_connected', true)
          .eq('contract_signed', true);

        if (profileError) {
          console.error('Error fetching creators:', profileError);
          return;
        }

        // For each creator, get sample media items and count
        const creatorsWithMedia = await Promise.all(
          profiles.map(async (profile) => {
            const { data: mediaItems } = await supabase
              .from('media_items')
              .select('thumbnail_url, media_type, full_url')
              .eq('creator_id', profile.id)
              .eq('is_available', true)
              .limit(4);

            return {
              id: profile.id,
              name: profile.name,
              avatar_url: profile.avatar_url || '',
              bio: profile.bio,
              tags: profile.tags || [],
              restrictions: profile.restrictions || [],
              social_media_connected: profile.social_media_connected,
              contract_signed: profile.contract_signed,
              media_count: mediaItems?.length || 0,
              sample_media: mediaItems || []
            };
          })
        );

        setCreators(creatorsWithMedia);
      } catch (error) {
        console.error('Error fetching creators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  // Get all unique tags from creators
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    creators.forEach((creator) => {
      creator.tags.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags);
  }, [creators]);

  // Filter creators based on search and tags
  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some((tag: string) => creator.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
  }, [creators, searchTerm, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  const handleSearchInput = (value: string) => {
    setSearchTerm(value);
    // Note: Instagram URL search functionality would need to be implemented
    // with the new database structure if needed
  };
    return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
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
                Welcome, {user?.name}
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

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Creator Catalog</h1>
          <p className="text-muted-foreground">
            Discover authentic content from verified creators. Browse their private galleries and license the perfect content for your needs.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search creators by name or paste Instagram URL..."
              value={searchTerm}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>

          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter by tags</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap pt-2">
                {allTags.map(tag => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? "cta" : "minimal"}
                    size="sm"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTags([])}
                    className="text-muted-foreground"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Creator Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading creators...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCreators.map((creator) => (
              <Card key={creator.id} className="overflow-hidden hover:shadow-md smooth-transition group">
                <div className="relative h-64 overflow-hidden">
                  {/* Gallery preview grid */}
                  <div className="grid grid-cols-2 h-full gap-0.5">
                    {creator.sample_media?.slice(0, 4).map((item, index) => {
                      const isVideo = item.media_type === 'video';
                      
                      return (
                        <div 
                          key={index} 
                          className="relative overflow-hidden"
                        >
                          {isVideo ? (
                            <video
                              src={item.full_url}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              autoPlay
                              loop
                              muted
                              playsInline
                            />
                          ) : (
                            <img
                              src={item.thumbnail_url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          )}
                          {isVideo && (
                            <div className="absolute top-2 left-2 bg-black/70 p-1 rounded-sm">
                              <Play className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {creator.media_count === 1 && (
                      <div className="bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">More content available</span>
                      </div>
                    )}
                    {creator.media_count === 0 && (
                      <div className="col-span-2 bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">No content available</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Creator Info Section */}
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">{creator.name}</h3>
                    {creator.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{creator.bio}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {creator.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {creator.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{creator.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <Button asChild variant="gradient-outline" className="w-full">
                    <Link to={`/profile/${creator.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Gallery ({creator.media_count} items)
                    </Link>
                  </Button>
                </CardContent>

                {/* Restrictions Section */}
                {creator.restrictions.length > 0 && (
                  <div className="p-3 bg-warning/10 text-xs text-muted-foreground border-t border-border">
                    <span className="font-medium">Restrictions: </span>
                    {creator.restrictions.join(', ')}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {filteredCreators.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-4">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No creators found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to find more creators.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedTags([]);
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </main>
      
      <CartModal isOpen={showCartModal} onClose={() => setShowCartModal(false)} />
    </div>
  );
};

export default BuyerCatalog;