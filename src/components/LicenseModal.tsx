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
  type: 'Commercial' | 'Editorial';
  territory: 'Local' | 'Regional' | 'Global';
  duration: string;
  exclusivity: boolean;
}

const LicenseModal: React.FC<LicenseModalProps> = ({ creator, selectedItems, onClose }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [licenseTerms, setLicenseTerms] = useState<LicenseTerms>({
    type: 'Commercial',
    territory: 'Global',
    duration: '12 months',
    exclusivity: false,
  });

  // Mock pricing calculation
  const calculatePrice = () => {
    let basePrice = selectedItems.length * 50; // $50 per item
    
    if (licenseTerms.type === 'Commercial') basePrice *= 2;
    if (licenseTerms.territory === 'Global') basePrice *= 1.5;
    if (licenseTerms.territory === 'Regional') basePrice *= 1.2;
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">License Agreement</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Items */}
          <div>
            <h3 className="font-semibold mb-3">Selected Content</h3>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {selectedItems.slice(0, 8).map((item) => (
                <img
                  key={item.id}
                  src={item.thumb}
                  alt={item.caption}
                  className="w-full h-16 object-cover rounded border"
                />
              ))}
              {selectedItems.length > 8 && (
                <div className="w-full h-16 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
                  +{selectedItems.length - 8} more
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedItems.length} items from {creator.name}
            </p>
          </div>

          {/* License Terms */}
          <div className="space-y-4">
            <h3 className="font-semibold">License Terms</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="usage-type">Usage Type</Label>
                <Select 
                  value={licenseTerms.type} 
                  onValueChange={(value: 'Commercial' | 'Editorial') => 
                    setLicenseTerms(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Editorial">Editorial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="territory">Territory</Label>
                <Select 
                  value={licenseTerms.territory} 
                  onValueChange={(value: 'Local' | 'Regional' | 'Global') => 
                    setLicenseTerms(prev => ({ ...prev, territory: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Local">Local</SelectItem>
                    <SelectItem value="Regional">Regional</SelectItem>
                    <SelectItem value="Global">Global</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Duration</Label>
                <Select 
                  value={licenseTerms.duration} 
                  onValueChange={(value) => 
                    setLicenseTerms(prev => ({ ...prev, duration: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3 months">3 months</SelectItem>
                    <SelectItem value="6 months">6 months</SelectItem>
                    <SelectItem value="12 months">12 months</SelectItem>
                    <SelectItem value="24 months">24 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="exclusivity"
                  checked={licenseTerms.exclusivity}
                  onCheckedChange={(checked) => 
                    setLicenseTerms(prev => ({ ...prev, exclusivity: checked }))
                  }
                />
                <Label htmlFor="exclusivity" className="text-sm">
                  Exclusive rights
                </Label>
              </div>
            </div>

            {/* Restrictions Warning */}
            {creator.restrictions.length > 0 && (
              <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-warning" />
                  <span className="font-medium">Usage Restrictions Apply:</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {creator.restrictions.join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Base price ({selectedItems.length} items)</span>
                <span>${selectedItems.length * 50}</span>
              </div>
              {licenseTerms.type === 'Commercial' && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Commercial usage</span>
                  <span>+100%</span>
                </div>
              )}
              {licenseTerms.territory !== 'Local' && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{licenseTerms.territory} territory</span>
                  <span>+{licenseTerms.territory === 'Global' ? '50%' : '20%'}</span>
                </div>
              )}
              {licenseTerms.exclusivity && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Exclusive rights</span>
                  <span>+100%</span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
                <>Processing...</>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Purchase License - ${price}
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            This is a demo transaction. No actual payment will be processed.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LicenseModal;