import React from 'react';
import { Button, Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

interface CartBadgeProps {
  cartCount: number;
  onCartClick: () => void;
}

const CartBadge: React.FC<CartBadgeProps> = ({ cartCount, onCartClick }) => {
  return (
    <div className="text-right mb-6">
      <Badge count={cartCount} showZero={false}>
        <Button 
          type="primary" 
          icon={<ShoppingCartOutlined />}
          size="large"
          onClick={onCartClick}
        >
          ตะกร้า ({cartCount})
        </Button>
      </Badge>
    </div>
  );
};

export default CartBadge;
