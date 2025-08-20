import React from 'react';
import { Typography, Card, Row, Col, Button, Space, Divider, Tag } from 'antd';
import { CoffeeOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { MenuCategory, MenuItem } from '@/types';
import { useOrderMenuLogic } from '@/presentation/hooks/legacy/useCustomerOrderMenu';

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
  const { displayItems } = useOrderMenuLogic(menuItems, selectedCategory);

  return (
    <div>
      <Title level={2} className="mb-6">เลือกเมนูเครื่องดื่ม</Title>
      <Paragraph className="text-gray-600 mb-8">
        เลือกเมนูที่ต้องการและดำเนินการชำระเงินเพื่อรับ QR Code
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
              className={!item.is_available ? 'opacity-70' : ''}
              cover={
                item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    alt={item.name}
                    src={item.image_url}
                    className="h-48 w-full object-cover"
                    onError={(e) => {
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
            >
              <div>
                <div className="flex justify-between items-start mb-2 border-b pb-2">
                  <Text strong className="text-lg">{item.name}</Text>
                  <Tag color={item.is_available ? 'green' : 'red'} style={{ fontWeight: 500, fontSize: 15, padding: '4px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {item.is_available ? (
                      <>
                        <span style={{ color: '#10b981' }}>พร้อมจำหน่าย</span>
                      </>
                    ) : (
                      <>
                        <span style={{ color: '#ef4444' }}>ไม่พร้อมจำหน่าย</span>
                      </>
                    )}
                  </Tag>
                </div>
                <Paragraph className="text-gray-600 text-sm mb-2 min-h-[40px]">
                  {item.description}
                </Paragraph>
                <div className="flex justify-between items-center">
                  <Text className="text-lg font-semibold text-green-600">
                    ฿{item.base_price}
                  </Text>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => onItemSelect(item)}
                    disabled={!item.is_available}
                  >
                    เพิ่มลงตะกร้า
                  </Button>
                </div>
              </div>
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
