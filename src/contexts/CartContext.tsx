import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { MediaItem, Creator } from '@/data/mockData';

interface CartItem {
  id: string;
  user_id: string;
  creator_id: string;
  media_item_id: string;
  media_item_data: any;
  created_at: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (mediaItem: MediaItem, creator: Creator) => Promise<void>;
  removeFromCart: (mediaItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setCartItems([]);
        return;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching cart items:', error);
        return;
      }

      setCartItems((data || []) as CartItem[]);
    } catch (error) {
      console.error('Error in fetchCartItems:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (mediaItem: MediaItem, creator: Creator) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to add items to cart.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          creator_id: creator.id,
          media_item_id: mediaItem.id,
          media_item_data: JSON.parse(JSON.stringify({
            mediaItem,
            creator
          }))
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Item already in cart",
            description: "This item is already in your cart.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Added to cart",
        description: `${mediaItem.caption} has been added to your cart.`,
      });

      fetchCartItems();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (mediaItemId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('media_item_id', mediaItemId);

      if (error) throw error;

      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
      });

      fetchCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems([]);
      
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCartItems();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        fetchCartItems();
      } else if (event === 'SIGNED_OUT') {
        setCartItems([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const cartCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        loading,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};