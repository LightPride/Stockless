import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { Trash2, ShoppingBag, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, clearCart, cartCount } = useCart();
  const navigate = useNavigate();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCart = async () => {
    setIsClearing(true);
    await clearCart();
    setIsClearing(false);
  };

  const groupedItems = cartItems.reduce((acc, item) => {
    const creatorId = item.creator_id;
    if (!acc[creatorId]) {
      acc[creatorId] = {
        creator: item.media_item_data.creator,
        items: []
      };
    }
    acc[creatorId].items.push(item);
    return acc;
  }, {} as Record<string, { creator: any; items: typeof cartItems }>);

  const handleCheckoutCreator = (creatorId: string) => {
    const creatorGroup = groupedItems[creatorId];
    if (!creatorGroup) return;

    // Navigate to creator gallery with selected items
    navigate(`/profile/${creatorId}`, {
      state: {
        selectedItems: creatorGroup.items.map(item => item.media_item_data.mediaItem),
        fromCart: true
      }
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] bg-card border-border">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" />
            Cart ({cartCount} items)
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-150px)]">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground">Start browsing creators to add items to your cart</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([creatorId, group]) => (
                <div key={creatorId} className="bg-muted/20 rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={group.creator.avatar}
                        alt={group.creator.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-foreground">{group.creator.name}</h4>
                        <p className="text-sm text-muted-foreground">{group.items.length} items</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCheckoutCreator(creatorId)}
                      variant="cta"
                      size="sm"
                    >
                      Checkout Items
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
                    {group.items.map((item) => (
                      <div key={item.id} className="relative group">
                        <img
                          src={item.media_item_data.mediaItem.thumb}
                          alt={item.media_item_data.mediaItem.caption}
                          className="w-full aspect-square object-cover rounded border border-border"
                        />
                        <button
                          onClick={() => removeFromCart(item.media_item_id)}
                          className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleClearCart}
              disabled={isClearing}
              className="flex-1"
            >
              {isClearing ? 'Clearing...' : 'Clear Cart'}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Continue Shopping
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;