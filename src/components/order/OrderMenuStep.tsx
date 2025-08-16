import React from 'react';
import { Typography, Card, Row, Col, Button, Space, Divider } from 'antd';
import { CoffeeOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { MenuCategory, MenuItem } from '@/types';

const { Title, Text, Paragraph } = Typography;

interface OrderMenuStepProps {
  menuCategories: MenuCategory[];
  menuItems: MenuItem[];
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number | null) => void;
  onItemSelect: (item: MenuItem) => void;
  onBack?: () => void;
}

const OrderMenuStep: React.FC<OrderMenuStepProps> = ({
  menuCategories,
  menuItems,
  selectedCategory,
  onCategorySelect,
  onItemSelect,
  onBack,
}) => {
  const getItemsByCategory = (categoryId: number) => {
    return menuItems.filter(item => item.category_id === categoryId);
  };

  const displayItems = selectedCategory ? getItemsByCategory(selectedCategory) : menuItems;

  return (
    <div>
      <Title level={2} className="mb-6">เลือกเมนูเครื่องดื่ม</Title>
      <Paragraph className="text-gray-600 mb-8">
        เลือกเมนูและชำระเงินเพื่อรับ QR Code
      </Paragraph>

      {/* Category Tabs */}
      <div className="mb-6">
        <Space wrap>
          <Button 
            type={selectedCategory === null ? "primary" : "default"}
            onClick={() => onCategorySelect(null)}
          >
            ทั้งหมด
          </Button>
          {menuCategories.map(category => (
            <Button
              key={category.id}
              type={selectedCategory === category.id ? "primary" : "default"}
              onClick={() => onCategorySelect(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </Space>
      </div>

      {/* Menu Items */}
      <Row gutter={[16, 16]} className="mb-8">
        {displayItems.map(item => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <Card
              hoverable
              cover={
                item.image_url ? (
                  <img 
                    alt={item.name}
                    src={item.image_url}
                    className="h-48 w-full object-cover"
                    onError={(e) => {
                      // ถ้ารูปไม่โหลดได้ ให้แสดงไอคอนแทน
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="h-48 bg-gray-100 flex items-center justify-center">
                            <svg class="text-4xl text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                            </svg>
                          </div>
                        `;
                      }
                    }}
                  />
                ) : (
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <CoffeeOutlined className="text-4xl text-gray-400" />
                  </div>
                )
              }
              actions={[
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => onItemSelect(item)}
                >
                  เพิ่มลงตะกร้า
                </Button>
              ]}
            >
              <Card.Meta
                title={item.name}
                description={
                  <div>
                    <Paragraph className="text-gray-600 mb-2">
                      {item.description}
                    </Paragraph>
                    <Text strong className="text-lg text-green-600">
                      ฿{item.base_price}
                    </Text>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Back Button Section */}
      {onBack && (
        <>
          <Divider />
          <div className="flex justify-center">
            <Button 
              onClick={onBack}
              icon={<ArrowLeftOutlined />}
              size="large"
              className="h-12 px-8 text-lg border-gray-300 hover:bg-gray-50"
            >
              ย้อนกลับ
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderMenuStep;
