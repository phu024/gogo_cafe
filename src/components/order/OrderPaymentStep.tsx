import React from 'react';
import { Typography, Card, Row, Col, Button, Space, Divider } from 'antd';
import { ShoppingCartOutlined, CreditCardOutlined, QrcodeOutlined } from '@ant-design/icons';
import { CartItem } from '@/types';

const { Title, Text } = Typography;

interface OrderPaymentStepProps {
  cart: CartItem[];
  onPayment: () => void;
}

const OrderPaymentStep: React.FC<OrderPaymentStepProps> = ({
  cart,
  onPayment,
}) => {
  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.total_price, 0);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <Title level={2} className="mb-2">ชำระเงิน</Title>
        <Typography.Paragraph className="text-gray-600 text-lg">
          เลือกวิธีชำระเงินที่สะดวกสำหรับคุณ
        </Typography.Paragraph>
      </div>
      
      <Row gutter={[32, 24]}>
        {/* รายละเอียดการสั่งซื้อ */}
        <Col xs={24} lg={14}>
          <Card 
            title={
              <div className="flex items-center">
                <ShoppingCartOutlined className="text-xl text-blue-500 mr-2" />
                <span>สรุปรายการสั่งซื้อ</span>
              </div>
            }
            className="mb-6 shadow-sm"
            headStyle={{ borderBottom: '2px solid #f0f0f0' }}
          >
            {/* สรุปยอดรวม */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <Text className="text-gray-600">จำนวนรายการ</Text>
                  <div className="text-2xl font-bold text-blue-600">{cart.length} รายการ</div>
                </div>
                <div className="text-right">
                  <Text className="text-gray-600">ยอดรวม</Text>
                  <div className="text-3xl font-bold text-green-600">฿{getTotalAmount()}</div>
                </div>
              </div>
            </div>
            
            {/* รายการสินค้า */}
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <ShoppingCartOutlined className="text-xl text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Text strong className="text-lg">{item.menu_item.name}</Text>
                        <div className="flex items-center mt-1">
                          <Text className="text-gray-600 mr-2">x{item.quantity}</Text>
                          {item.toppings.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.toppings.map(topping => (
                                <span key={topping.id} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mr-1">
                                  +{topping.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {item.notes && (
                          <Typography.Paragraph className="text-gray-500 text-sm mt-1 mb-0">
                            หมายเหตุ: {item.notes}
                          </Typography.Paragraph>
                        )}
                      </div>
                      <div className="text-right">
                        <Text strong className="text-lg text-green-600">฿{item.total_price}</Text>
                        <div className="text-sm text-gray-500">
                          ฿{Math.round(item.total_price / item.quantity)}/ชิ้น
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* วิธีชำระเงิน */}
          <Card 
            title={
              <div className="flex items-center">
                <CreditCardOutlined className="text-xl text-green-500 mr-2" />
                <span>เลือกวิธีชำระเงิน</span>
              </div>
            }
            className="shadow-sm"
            headStyle={{ borderBottom: '2px solid #f0f0f0' }}
          >
            <div className="space-y-4">
              {/* บัตรเครดิต/เดบิต */}
              <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors cursor-pointer">
                <Button 
                  type="text" 
                  className="w-full h-auto p-0 text-left"
                  onClick={onPayment}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <CreditCardOutlined className="text-2xl text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">บัตรเครดิต/เดบิต</div>
                      <div className="text-gray-600">ชำระผ่านบัตร Visa, Mastercard, JCB</div>
                    </div>
                    <div className="text-blue-500">
                      <CreditCardOutlined className="text-xl" />
                    </div>
                  </div>
                </Button>
              </div>

              {/* QR Code */}
              <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-400 transition-colors cursor-pointer">
                <Button 
                  type="text" 
                  className="w-full h-auto p-0 text-left"
                  onClick={onPayment}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <QrcodeOutlined className="text-2xl text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">โอนเงินผ่าน QR Code</div>
                      <div className="text-gray-600">สแกน QR Code เพื่อโอนเงินผ่านธนาคาร</div>
                    </div>
                    <div className="text-green-500">
                      <QrcodeOutlined className="text-xl" />
                    </div>
                  </div>
                </Button>
              </div>

              {/* เงินสด */}
              <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-400 transition-colors cursor-pointer">
                <Button 
                  type="text" 
                  className="w-full h-auto p-0 text-left"
                  onClick={onPayment}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-orange-600">฿</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">เงินสด</div>
                      <div className="text-gray-600">ชำระเงินสดที่เคาน์เตอร์</div>
                    </div>
                    <div className="text-orange-500">
                      <span className="text-xl">฿</span>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </Card>
        </Col>
        
        {/* ข้อมูลเพิ่มเติม */}
        <Col xs={24} lg={10}>
          {/* ข้อมูลการจัดส่ง */}
          <Card 
            title={
              <div className="flex items-center">
                <span className="text-xl mr-2">📍</span>
                <span>ข้อมูลการรับ</span>
              </div>
            }
            className="shadow-sm"
            headStyle={{ borderBottom: '2px solid #f0f0f0' }}
          >
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-sm">📍</span>
                </div>
                <div>
                  <Text strong>จุดรับเครื่องดื่ม</Text>
                  <div className="text-gray-600">เคาน์เตอร์ด้านหน้า</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 text-sm">⏱️</span>
                </div>
                <div>
                  <Text strong>เวลารอโดยประมาณ</Text>
                  <div className="text-gray-600">5-15 นาที</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-orange-600 text-sm">📱</span>
                </div>
                <div>
                  <Text strong>การแจ้งเตือน</Text>
                  <div className="text-gray-600">ผ่าน QR Code</div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderPaymentStep;
