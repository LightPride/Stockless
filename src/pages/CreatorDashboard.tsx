import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { mockCreators, mockRequests, mockBuyers } from '@/data/mockData';
import { Camera, Instagram, Upload, DollarSign, Clock, CheckCircle, LogOut, User, Plus, X, FileText, AlertTriangle, Edit2 } from 'lucide-react';
import ContractModal from '@/components/ContractModal';

const CreatorDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const [dataVersion, setDataVersion] = useState(0);
  
  // Find creator data from localStorage or mock data
  const creator = useMemo(() => {
    const storedCreators = localStorage.getItem('stockless_creators');
    const allCreators = storedCreators ? JSON.parse(storedCreators) : mockCreators;
    return allCreators.find((c: any) => c.id === id) || allCreators[0];
  }, [id, dataVersion]);

  // Get requests for this creator
  const creatorRequests = useMemo(() => {
    const storedRequests = localStorage.getItem('stockless_requests');
    const allRequests = storedRequests ? JSON.parse(storedRequests) : mockRequests;
    return allRequests.filter((req: any) => req.creatorId === creator.id);
  }, [creator.id, dataVersion]);

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: creator.name,
    tags: [...creator.tags],
    restrictions: [...creator.restrictions],
  });
  const [newTag, setNewTag] = useState('');
  const [newRestriction, setNewRestriction] = useState('');
  const [showContractModal, setShowContractModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState('');

  const handleSaveProfile = () => {
    // Persist edits to mock DB (localStorage)
    const storedCreators = localStorage.getItem('stockless_creators');
    const allCreators = storedCreators ? JSON.parse(storedCreators) : mockCreators;
    const idx = allCreators.findIndex((c: any) => c.id === creator.id);
    if (idx !== -1) {
      allCreators[idx] = {
        ...allCreators[idx],
        name: editedProfile.name,
        tags: editedProfile.tags,
        restrictions: editedProfile.restrictions,
      };
      localStorage.setItem('stockless_creators', JSON.stringify(allCreators));
    }

    // Keep users table in sync for header display/name
    const storedUsers = localStorage.getItem('stockless_users');
    const allUsers = storedUsers ? JSON.parse(storedUsers) : [];
    const uIdx = allUsers.findIndex((u: any) => u.id === creator.id);
    if (uIdx !== -1) {
      allUsers[uIdx] = { ...allUsers[uIdx], name: editedProfile.name };
      localStorage.setItem('stockless_users', JSON.stringify(allUsers));
    }

    setIsEditing(false);
    setDataVersion((v) => v + 1);
  };

  const handleCancelEdit = () => {
    setEditedProfile({
      name: creator.name,
      tags: [...creator.tags],
      restrictions: [...creator.restrictions],
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

  const totalEarnings = creatorRequests
    .filter(req => req.status === 'Completed')
    .reduce((sum, req) => sum + req.price, 0);

  const handleLogout = () => {
    logout();
  };

  const handleConnectSocialMedia = () => {
    if (!creator.contractSigned) {
      setShowContractModal(true);
    } else {
      // Persist connection status to mock DB (localStorage)
      const storedCreators = localStorage.getItem('stockless_creators');
      const allCreators = storedCreators ? JSON.parse(storedCreators) : mockCreators;
      const idx = allCreators.findIndex((c: any) => c.id === creator.id);
      if (idx !== -1) {
        allCreators[idx] = { ...allCreators[idx], socialMediaConnected: true };
        localStorage.setItem('stockless_creators', JSON.stringify(allCreators));
      }
      setDataVersion((v) => v + 1);
    }
  };

  const handleSignContract = () => {
    // Update contractSigned in mock DB (localStorage)
    const storedCreators = localStorage.getItem('stockless_creators');
    const allCreators = storedCreators ? JSON.parse(storedCreators) : mockCreators;
    const idx = allCreators.findIndex((c: any) => c.id === creator.id);
    if (idx !== -1) {
      allCreators[idx] = { ...allCreators[idx], contractSigned: true };
      localStorage.setItem('stockless_creators', JSON.stringify(allCreators));
    }
    setShowContractModal(false);
    setDataVersion((v) => v + 1);
  };

  const handleSavePhoto = () => {
    if (creator && newAvatarUrl.trim()) {
      const storedCreators = localStorage.getItem('stockless_creators');
      const allCreators = storedCreators ? JSON.parse(storedCreators) : mockCreators;
      const idx = allCreators.findIndex((c: any) => c.id === creator.id);
      if (idx !== -1) {
        allCreators[idx] = { ...allCreators[idx], avatar: newAvatarUrl.trim() };
        localStorage.setItem('stockless_creators', JSON.stringify(allCreators));
      }
      setShowPhotoModal(false);
      setNewAvatarUrl('');
      setDataVersion((v) => v + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header style="background-color: #1f1f1f" className="bg-white border-b border-border sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-black font-bold text-lg">S</span>
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
            Manage your profile, connect social media, and track licensing requests.
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
                      <Button variant="cta" onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
                      onClick={() => setShowPhotoModal(true)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold">{creator.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {creator.gallery.length} items in gallery
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
                        {creator.socialMediaConnected ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  {creator.socialMediaConnected ? (
                    <Badge variant="success">Connected</Badge>
                  ) : (
                    <Button variant="cta" onClick={handleConnectSocialMedia}>
                      Connect
                    </Button>
                  )}
                </div>
                
                {!creator.contractSigned && (
                  <div className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-warning mb-1">Contract Required</p>
                        <p className="text-muted-foreground mb-2">
                          You must sign the Estonian licensing contract before connecting social media.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowContractModal(true)}
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          View Contract
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {creator.contractSigned && (
                  <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-success mb-1">Contract Signed</p>
                        <p className="text-muted-foreground mb-2">
                          Estonian licensing contract has been signed and is active.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowContractModal(true)}
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          View Contract
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground mt-3">
                  {creator.socialMediaConnected 
                    ? `Synced ${creator.gallery.length} items from your Instagram account.`
                    : creator.contractSigned 
                      ? 'Ready to connect your Instagram account.'
                      : 'Sign the contract to enable Instagram connection.'
                  }
                </p>
              </CardContent>
            </Card>

            {/* License Requests */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle>License Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {creatorRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No requests yet</h3>
                    <p className="text-sm text-muted-foreground">
                      License requests will appear here when buyers request your content.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {creatorRequests.map((request) => {
                      const buyer = mockBuyers.find(b => b.id === request.buyerId);
                      return (
                        <div key={request.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-medium">{buyer?.name || 'Unknown Buyer'}</p>
                              <p className="text-sm text-muted-foreground">
                                Requested {request.media.length} items • {request.createdAt}
                              </p>
                            </div>
                            <Badge 
                              variant={request.status === 'Completed' ? 'success' : 'secondary'}
                            >
                              {request.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-muted-foreground">Media:</span>
                              <span className="ml-2">{request.licenseTerms.mediaType}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Editing:</span>
                              <span className="ml-2">{request.licenseTerms.editingRights ? 'Allowed' : 'Not allowed'}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Duration:</span>
                              <span className="ml-2">{request.licenseTerms.duration}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Price:</span>
                              <span className="ml-2 font-medium text-success">${request.price}</span>
                            </div>
                          </div>
                          
                          {request.status === 'Pending' && (
                            <div className="flex gap-2">
                              <Button variant="cta" size="sm">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Originals
                              </Button>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Gallery */}
          <div className="space-y-6">
            {/* Earnings Card */}
            <Card className="shadow-medium border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success mb-2">
                    ${totalEarnings}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    From {creatorRequests.filter(r => r.status === 'Completed').length} completed licenses
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Contract Modal */}
        <ContractModal
          isOpen={showContractModal}
          onClose={() => setShowContractModal(false)}
          onSign={handleSignContract}
          creatorName={creator.name}
        />

        {/* Photo Change Modal */}
        <Dialog open={showPhotoModal} onOpenChange={setShowPhotoModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Change Profile Photo</DialogTitle>
              <DialogDescription>
                Enter the URL of your new profile photo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="avatar-url">Photo URL</Label>
                <Input
                  id="avatar-url"
                  placeholder="https://example.com/your-photo.jpg"
                  value={newAvatarUrl}
                  onChange={(e) => setNewAvatarUrl(e.target.value)}
                />
              </div>
              {newAvatarUrl && (
                <div className="flex justify-center">
                  <img
                    src={newAvatarUrl}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover"
                    onError={() => {}}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPhotoModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePhoto} disabled={!newAvatarUrl.trim()}>
                Save Photo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default CreatorDashboard;