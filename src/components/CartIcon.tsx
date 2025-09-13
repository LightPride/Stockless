import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface CartIconProps {
  onClick: () => void;
  className?: string;
}

const CartIcon: React.FC<CartIconProps> = ({ onClick, className = "" }) => {
  const { cartCount } = useCart();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`relative ${className}`}
    >
      <ShoppingCart className="h-5 w-5" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {cartCount > 9 ? '9+' : cartCount}
        </span>
      )}
    </Button>
  );
};

export default CartIcon;