import React from 'react';
import { Form, Input, Button, Checkbox, Typography } from 'antd';

interface BookingDetailsFormProps {
    onBack: () => void;
    onProceed: () => void;
  }

  const BookingDetailsForm: React.FC<BookingDetailsFormProps> = ({ onBack, onProceed }) => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Booking Details Submitted:', values);
        onProceed(); 
      };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ maxWidth: 600, margin: '0 auto' }}
        >
            <Typography.Title level={3} style={{ textAlign: 'center' }}>
                Booking Details
            </Typography.Title>

            {/* Recipient Name */}
            <Form.Item
                label="Recipient Name"
                name="recipientName"
                rules={[{ required: true, message: 'Please enter the recipient name' }]}
            >
                <Input placeholder="Enter recipient name" />
            </Form.Item>

            {/* Service Address */}
            <Form.Item
                label="Service Address"
                name="serviceAddress"
                rules={[{ required: true, message: 'Please enter the service address' }]}
            >
                <Input placeholder="Enter service address" />
            </Form.Item>

            {/* City */}
            <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: 'Please enter the city' }]}
            >
                <Input placeholder="Enter city" />
            </Form.Item>

            {/* State */}
            <Form.Item
                label="State"
                name="state"
                rules={[{ required: true, message: 'Please enter the state' }]}
            >
                <Input placeholder="Enter state" />
            </Form.Item>

            {/* Zip Code */}
            <Form.Item
                label="Zip Code"
                name="zipCode"
                rules={[{ required: true, message: 'Please enter the zip code' }]}
            >
                <Input placeholder="Enter zip code" />
            </Form.Item>

            {/* Preferred Service Date */}
            <Form.Item
                label="Preferred Service Date"
                name="serviceDate"
                rules={[{ required: true, message: 'Please select the service date' }]}
            >
                <Input type="date" />
            </Form.Item>

            {/* Preferred Time */}
            <Form.Item label="Preferred Time (for Rush or Priority Service)" name="preferredTime">
                <Input type="time" />
            </Form.Item>

            {/* Payment Information */}
            <Form.Item label="Payment Method" name="paymentMethod" rules={[{ required: true, message: 'Please select a payment method' }]}>
                <Checkbox.Group>
                    <Checkbox value="creditCard">Credit/Debit Card</Checkbox>
                    <Checkbox value="paypal">PayPal</Checkbox>
                    <Checkbox value="bankTransfer">Bank Transfer</Checkbox>
                </Checkbox.Group>
            </Form.Item>

            {/* Terms and Conditions */}
            <Form.Item
                name="terms"
                valuePropName="checked"
                rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('You must agree to the terms and conditions') }]}
            >
                <Checkbox>
                    I agree to the terms and conditions of DeizyexpressLLC. All payments are due upfront, and refunds are only available if service attempts are not made.
                </Checkbox>
            </Form.Item>

            {/* Signature */}
            <Form.Item
                label="Signature"
                name="signature"
                rules={[{ required: true, message: 'Please provide your signature' }]}
            >
                <Input placeholder="Enter your signature" />
            </Form.Item>

            {/* Date */}
            <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: 'Please select the date' }]}
            >
                <Input type="date" />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
                <div style={{display: 'flex', gap: "10px"}}>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Book Now
                    </Button>
                    <Button htmlType="button" style={{ width: '100%' }} onClick={onBack}>
                        Back
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

export default BookingDetailsForm;
