import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Creator, MediaItem } from '@/data/mockData';
import { CreditCard, Clock, Globe, Shield } from 'lucide-react';

interface LicenseModalProps {
  creator: Creator;
  selectedItems: MediaItem[];
  onClose: () => void;
}

interface LicenseTerms {
  mediaType: 'Photo' | 'Video';
  editingRights: boolean;
  duration: string;
  exclusivity: boolean;
  region: string;
}

const LicenseModal: React.FC<LicenseModalProps> = ({ creator, selectedItems, onClose }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [licenseTerms, setLicenseTerms] = useState<LicenseTerms>({
    mediaType: 'Photo',
    editingRights: false,
    duration: '12 months',
    exclusivity: false,
    region: 'worldwide',
  });

  const calculatePrice = () => {
    let basePrice = selectedItems.length * 50; // $50 per item
    
    if (licenseTerms.mediaType === 'Video') basePrice *= 1.5;
    if (licenseTerms.editingRights) basePrice *= 1.3;
    if (licenseTerms.exclusivity) basePrice *= 2;
    
    const duration = parseInt(licenseTerms.duration);
    if (duration >= 24) basePrice *= 1.5;
    else if (duration >= 12) basePrice *= 1.2;
    
    return Math.round(basePrice);
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create license request and store in localStorage
    const newRequest = {
      id: `req_${Date.now()}`,
      buyerId: 'buyer1', // In real app, get from auth context
      creatorId: creator.id,
      media: selectedItems.map(item => item.id),
      status: 'Pending' as const,
      licenseTerms,
      createdAt: new Date().toISOString().split('T')[0],
      price: calculatePrice(),
    };

    // Store request in localStorage
    const storedRequests = localStorage.getItem('stockless_requests');
    const allRequests = storedRequests ? JSON.parse(storedRequests) : [];
    const updatedRequests = [...allRequests, newRequest];
    localStorage.setItem('stockless_requests', JSON.stringify(updatedRequests));
    
    toast({
      title: 'License request sent!',
      description: `Your request for ${selectedItems.length} items has been processed.`,
    });

    // Navigate to success page with order details
    navigate('/checkout/success', {
      state: {
        creator,
        selectedItems,
        licenseTerms,
        price: calculatePrice(),
        orderId: `ORD-${Date.now()}`,
      }
    });
  };

  const price = calculatePrice();

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-card border-border">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground">License Agreement</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] space-y-6 pr-2">
          {/* Selected Items Grid */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Selected Content ({selectedItems.length} items)</h3>
            <div className="grid grid-cols-6 md:grid-cols-8 gap-2 mb-4">
              {selectedItems.slice(0, 16).map((item) => (
                <div key={item.id} className="relative group">
                  <img
                    src={item.thumb}
                    alt={item.caption}
                    className="w-full aspect-square object-cover rounded-sm border border-border"
                  />
                </div>
              ))}
              {selectedItems.length > 16 && (
                <div className="w-full aspect-square bg-muted rounded-sm border border-border flex items-center justify-center text-xs text-muted-foreground font-medium">
                  +{selectedItems.length - 16}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>From:</span>
              <span className="font-medium text-foreground">{creator.name}</span>
            </div>
          </div>

          {/* License Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">License Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="media-type" className="text-sm font-medium text-foreground">Media Type</Label>
                  <Select 
                    value={licenseTerms.mediaType} 
                    onValueChange={(value: 'Photo' | 'Video') => 
                      setLicenseTerms(prev => ({ ...prev, mediaType: value }))
                    }
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="Photo">Photo Content</SelectItem>
                      <SelectItem value="Video">Video Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration" className="text-sm font-medium text-foreground">License Duration</Label>
                  <Select 
                    value={licenseTerms.duration} 
                    onValueChange={(value) => 
                      setLicenseTerms(prev => ({ ...prev, duration: value }))
                    }
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="3 months">3 months</SelectItem>
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="12 months">12 months</SelectItem>
                      <SelectItem value="24 months">24 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="region" className="text-sm font-medium text-foreground">Usage Region</Label>
                  <Select 
                    value={licenseTerms.region} 
                    onValueChange={(value) => 
                      setLicenseTerms(prev => ({ ...prev, region: value }))
                    }
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="worldwide">Worldwide</SelectItem>
                      <SelectItem value="north-america">North America</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                      <SelectItem value="latin-america">Latin America</SelectItem>
                      <SelectItem value="middle-east-africa">Middle East & Africa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-sm border border-border">
                    <div>
                      <Label htmlFor="editing-rights" className="text-sm font-medium text-foreground">
                        Editing Rights
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Modify, crop, filter, and edit content
                      </p>
                    </div>
                    <Switch
                      id="editing-rights"
                      checked={licenseTerms.editingRights}
                      onCheckedChange={(checked) => 
                        setLicenseTerms(prev => ({ ...prev, editingRights: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-sm border border-border">
                    <div>
                      <Label htmlFor="exclusivity" className="text-sm font-medium text-foreground">
                        Exclusive License
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Exclusive rights to this content
                      </p>
                    </div>
                    <Switch
                      id="exclusivity"
                      checked={licenseTerms.exclusivity}
                      onCheckedChange={(checked) => 
                        setLicenseTerms(prev => ({ ...prev, exclusivity: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Price Breakdown</h3>
              <div className="bg-muted/30 rounded-sm p-4 border border-border">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base price ({selectedItems.length} items)</span>
                    <span className="text-foreground font-medium">${selectedItems.length * 50}</span>
                  </div>
                  
                  {licenseTerms.mediaType === 'Video' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Video content (+50%)</span>
                      <span className="text-foreground">+${Math.round(selectedItems.length * 50 * 0.5)}</span>
                    </div>
                  )}
                  
                  {licenseTerms.editingRights && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Editing rights (+30%)</span>
                      <span className="text-foreground">+${Math.round(selectedItems.length * 50 * 0.3)}</span>
                    </div>
                  )}
                  
                  {licenseTerms.exclusivity && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Exclusive rights (+100%)</span>
                      <span className="text-foreground">+${selectedItems.length * 50}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">${price}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Restrictions Warning */}
              {creator.restrictions.length > 0 && (
                <div className="p-3 bg-warning/10 rounded-sm border border-warning/20">
                  <div className="flex items-start gap-2 text-sm">
                    <Shield className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-warning">Usage Restrictions Apply</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {creator.restrictions.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant="cta" 
            onClick={handlePurchase} 
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Purchase License - ${price}
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center pt-2">
          This is a demo transaction. No actual payment will be processed.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default LicenseModal;