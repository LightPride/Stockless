import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { mockCreators } from '@/data/mockData';
import { Search, Filter, LogOut, User, Eye } from 'lucide-react';

const BuyerCatalog = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags from creators
  const allTags = useMemo(() => {
    const storedCreators = localStorage.getItem('stockless_creators');
    const allCreators = storedCreators ? JSON.parse(storedCreators) : mockCreators;
    const tags = new Set<string>();
    allCreators.forEach((creator: any) => {
      creator.tags.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  // Filter creators based on search and tags
  const filteredCreators = useMemo(() => {
    // Get creators from localStorage if available, otherwise use mock data
    const storedCreators = localStorage.getItem('stockless_creators');
    const allCreators = storedCreators ? JSON.parse(storedCreators) : mockCreators;
    
    return allCreators.filter((creator: any) => {
      // Only show creators who have signed contract and connected social media
      if (!creator.contractSigned || !creator.socialMediaConnected) {
        return false;
      }
      
      const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some((tag: string) => creator.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
  }, [searchTerm, selectedTags]);

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
    const url = value.trim();
    const isInstagramUrl = /https?:\/\/(www\.)?instagram\.com\//i.test(url);
    if (!isInstagramUrl) return;

    const normalized = url.replace(/\/?$/, '');
    const storedCreators = localStorage.getItem('stockless_creators');
    const allCreators = storedCreators ? JSON.parse(storedCreators) : mockCreators;

    
    for (const creator of allCreators) {
      const found = creator.gallery.find(
        (item: any) =>
          item.permalink.replace(/\/?$/, '') === normalized ||
          normalized.includes(item.permalink.replace(/\/?$/, '')) ||
          item.permalink.includes(normalized)
      );
      if (found) {
        navigate(`/profile/${creator.id}?select=${found.id}`);
        break;
      }
    }
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

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by tags:</span>
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
        </div>

        {/* Creator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCreators.map((creator) => (
            <Card key={creator.id} className="overflow-hidden hover:shadow-md smooth-transition group">
              <div className="relative h-64 overflow-hidden">
                {/* Gallery preview grid */}
                <div className="grid grid-cols-2 h-full gap-0.5">
                  {creator.gallery.slice(0, 4).map((item, index) => (
                    <div 
                      key={item.id} 
                      className="relative overflow-hidden"
                    >
                      <img
                        src={item.thumb}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ))}
                  {creator.gallery.length === 1 && (
                    <div className="bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">More content available</span>
                    </div>
                  )}
                  {creator.gallery.length === 0 && (
                    <div className="col-span-2 bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">No content available</span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {creator.socialMediaConnected && (
                  <Badge variant="success" className="absolute top-3 right-3 text-xs">
                    Connected
                  </Badge>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-semibold text-white mb-2">{creator.name}</h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {creator.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs bg-white/20 border-white/30 text-white">
                        {tag}
                      </Badge>
                    ))}
                    {creator.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-white/20 border-white/30 text-white">
                        +{creator.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <Button asChild variant="gradient-outline" className="w-full">
                    <Link to={`/profile/${creator.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Gallery
                    </Link>
                  </Button>
                </div>
              </div>

              {creator.restrictions.length > 0 && (
                <div className="p-3 bg-warning/10 text-xs text-muted-foreground border-t border-border">
                  <span className="font-medium">Restrictions: </span>
                  {creator.restrictions.join(', ')}
                </div>
              )}
            </Card>
          ))}
        </div>

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
    </div>
  );
};

export default BuyerCatalog;