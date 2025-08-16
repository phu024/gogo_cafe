import React from 'react';
import { Typography, Card, Row, Col, Button, Space } from 'antd';
import { QrcodeOutlined, CoffeeOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface OrderSuccessStepProps {
  orderStatus: number;
  onResetOrder: () => void;
}

const OrderSuccessStep: React.FC<OrderSuccessStepProps> = ({
  orderStatus,
  onResetOrder,
}) => {
  return (
    <div className="py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <QrcodeOutlined className="text-5xl text-white" />
        </div>
        <Title level={1} className="text-green-600 mb-3">สั่งซื้อสำเร็จ!</Title>
        <Paragraph className="text-lg text-gray-600 max-w-md mx-auto">
          ขอบคุณที่ใช้บริการ GOGO CAFE กรุณารอรับเครื่องดื่มที่เคาน์เตอร์
        </Paragraph>
      </div>

      <Row gutter={[32, 24]}>
        {/* สถานะการสั่งซื้อ */}
        <Col xs={24} lg={14}>
          <Card 
            title={
              <div className="flex items-center">
                <CoffeeOutlined className="text-xl text-blue-500 mr-2" />
                <span>สถานะการสั่งซื้อ</span>
              </div>
            }
            className="shadow-sm h-full"
            headStyle={{ borderBottom: '2px solid #f0f0f0' }}
          >
            {/* สถานะปัจจุบันแบบเรียบง่าย */}
            <div className={`p-6 rounded-lg border-2 ${
              orderStatus === 1 ? 'bg-blue-50 border-blue-300' :
              orderStatus === 2 ? 'bg-orange-50 border-orange-300' :
              orderStatus === 3 ? 'bg-green-50 border-green-300' : 'bg-blue-50 border-blue-300'
            }`}>
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  orderStatus === 1 ? 'bg-blue-100' :
                  orderStatus === 2 ? 'bg-orange-100' :
                  orderStatus === 3 ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <CoffeeOutlined className={`text-3xl ${
                    orderStatus === 1 ? 'text-blue-600' :
                    orderStatus === 2 ? 'text-orange-600' :
                    orderStatus === 3 ? 'text-green-600' : 'text-blue-600'
                  }`} />
                </div>
                
                <Title level={3} className={`mb-2 ${
                  orderStatus === 1 ? 'text-blue-700' :
                  orderStatus === 2 ? 'text-orange-700' :
                  orderStatus === 3 ? 'text-green-700' : 'text-blue-700'
                }`}>
                  {orderStatus === 1 ? 'กำลังเตรียมเครื่องดื่ม' :
                   orderStatus === 2 ? 'กำลังชงเครื่องดื่ม' :
                   orderStatus === 3 ? 'พร้อมรับที่เคาน์เตอร์' : 'กำลังเตรียมเครื่องดื่ม'}
                </Title>
                
                <Paragraph className={`text-lg ${
                  orderStatus === 1 ? 'text-blue-600' :
                  orderStatus === 2 ? 'text-orange-600' :
                  orderStatus === 3 ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {orderStatus === 1 ? 'คาดว่าจะเสร็จในอีกประมาณ 5-10 นาที' :
                   orderStatus === 2 ? 'คาดว่าจะเสร็จในอีกประมาณ 2-3 นาที' :
                   orderStatus === 3 ? 'เครื่องดื่มพร้อมรับแล้ว! กรุณาไปรับที่เคาน์เตอร์' : 'คาดว่าจะเสร็จในอีกประมาณ 5-10 นาที'}
                </Paragraph>
              </div>
            </div>

            {/* ข้อมูลเพิ่มเติม */}
            <div className="mt-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⏱️</span>
                  <div>
                    <Text strong>เวลารอโดยประมาณ</Text>
                    <div className="text-gray-600">5-15 นาที</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📍</span>
                  <div>
                    <Text strong>จุดรับเครื่องดื่ม</Text>
                    <div className="text-gray-600">เคาน์เตอร์ด้านหน้า</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📱</span>
                  <div>
                    <Text strong>การแจ้งเตือน</Text>
                    <div className="text-gray-600">ผ่าน QR Code</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* QR Code Section */}
        <Col xs={24} lg={10}>
          <Card 
            title={
              <div className="flex items-center">
                <QrcodeOutlined className="text-xl text-purple-500 mr-2" />
                <span>QR Code</span>
              </div>
            }
            className="shadow-sm h-full"
            headStyle={{ borderBottom: '2px solid #f0f0f0' }}
          >
            <div className="text-center">
              {/* QR Code Display */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-lg mb-6">
                <div className="w-48 h-48 bg-white mx-auto border-2 border-dashed border-purple-300 flex items-center justify-center rounded-lg shadow-sm">
                  <QrcodeOutlined className="text-6xl text-purple-400" />
                </div>
              </div>
              
              {/* Instructions */}
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-2">💡</span>
                    <Text className="text-blue-700 text-sm font-medium">
                      แสดง QR Code นี้ที่เคาน์เตอร์
                    </Text>
                  </div>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">📍</span>
                    <Text className="text-green-700 text-sm font-medium">
                      จุดรับ: เคาน์เตอร์ด้านหน้า
                    </Text>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <Button 
                  type="primary" 
                  size="large" 
                  block
                  icon={<QrcodeOutlined />}
                  className="bg-purple-500 hover:bg-purple-600 border-purple-500"
                >
                  ดาวน์โหลด QR Code
                </Button>
                <Button 
                  size="large" 
                  block
                  icon={<QrcodeOutlined />}
                  className="border-purple-300 text-purple-600 hover:border-purple-400 hover:text-purple-700"
                >
                  แชร์ QR Code
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bottom Actions */}
      <div className="text-center mt-12">
        <div className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto">
          <Text className="text-gray-600 mb-4 block">
            ต้องการสั่งซื้อเพิ่มเติมหรือไม่?
          </Text>
          <Space size="middle">
            <Button size="large" onClick={onResetOrder}>
              สั่งซื้อใหม่
            </Button>
            <Button type="default" size="large">
              กลับหน้าหลัก
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessStep;
