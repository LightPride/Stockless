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
    const tags = new Set<string>();
    mockCreators.forEach(creator => {
      creator.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  // Filter creators based on search and tags
  const filteredCreators = useMemo(() => {
    return mockCreators.filter(creator => {
      const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => creator.tags.includes(tag));
      
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

    for (const creator of mockCreators) {
      const found = creator.gallery.find(
        (item) =>
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
      <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold">Stockless</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => (
            <Card key={creator.id} className="overflow-hidden shadow-soft hover:shadow-medium smooth-transition border-0">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-foreground">
                    {creator.gallery.length} items
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold">{creator.name}</h3>
                  {creator.socialMediaConnected && (
                    <Badge variant="success" className="text-xs">
                      Connected
                    </Badge>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {creator.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {creator.restrictions.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Restrictions: </span>
                      {creator.restrictions.join(', ')}
                    </div>
                  )}
                </div>

                <Button asChild variant="cta" className="w-full">
                  <Link to={`/profile/${creator.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Gallery
                  </Link>
                </Button>
              </CardContent>
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