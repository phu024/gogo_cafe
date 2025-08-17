import React from 'react';
import { Button, Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

interface CartBadgeProps {
  cartCount: number;
  onCartClick: () => void;
  className?: string;
}

const CartBadge: React.FC<CartBadgeProps> = React.memo(({ 
  cartCount, 
  onCartClick, 
  className = 'text-right my-4 mr-2' 
}) => (
  <div className={className}>
    <Badge count={cartCount} showZero={false}>
      <Button 
        type="primary" 
        icon={<ShoppingCartOutlined />}
        size="large"
        onClick={onCartClick}
        className="min-w-[120px]"
        aria-label={`ตะกร้า (${cartCount} รายการ)`}
      >
        ตะกร้า ({cartCount})
      </Button>
    </Badge>
  </div>
));

CartBadge.displayName = "CartBadge";

export default CartBadge;
