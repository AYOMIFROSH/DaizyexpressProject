import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Typography, notification, message, Spin, Radio, TimePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import usePayment from '../../Hooks/usePayment';

interface BookingDetailsFormProps {
    onBack: () => void;
    onProceed: () => void;
    selectedAddOns: string[];
    totalPrice: number;
    selectedService: string | null;
}

const BookingDetailsForm: React.FC<BookingDetailsFormProps> = ({
    onBack,
    onProceed,
    selectedAddOns,
    totalPrice,
    selectedService
}) => {
    const [form] = Form.useForm();
    const [additionalAddress, setAdditionalAddress] = useState<any | null>(null); 
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    const { sendPaymentDetails, loading, error, success, pending, handlePaymentSuccess, setPending } = usePayment();

    useEffect(() => {
        if (loading) {
            message.loading('Processing payment...', 0);
        } else {
            message.destroy();
        }

        if (!pending) {
            error
        }

        if (error) {
            message.error(error, 5);
            setPending(false);
        }

        if (success) {
            handlePaymentSuccess();

            notification.success({
                message: 'Payment Successful',
                description: 'Your payment has been processed successfully.',
                placement: 'topRight',
            });
            handlePaymentSuccess();
            onProceed();
        }
    }, [loading, error, success, onProceed, handlePaymentSuccess]);


    const onFinish = async (values: any) => {
        if (paymentMethod === "paypal") {
            notification.error({
                message: "Payment Method Not Available",
                description: "PayPal payment is not available at the moment. Please select a card payment method.",
                placement: "topRight",
            });
            return;
        }

        if (!paymentMethod) {
            notification.error({
                message: "Payment Method Required",
                description: "Please select a payment method before proceeding.",
                placement: "topRight",
            });
            return;
        }

        if (values.preferredTime) {
            values.preferredTime = values.preferredTime.format('hh:mm A'); // Convert moment object to "hh:mm A" string
        }

        const bookingData = {
            
            ...values,
            selectedAddOns,
            totalPrice,
            selectedService,
            // paymentMethod,
            // additionalAddresses: additionalAddress ? {
            //     ...form.getFieldsValue(['recipientName_additional', 'serviceAddress_additional', 'city_additional', 'state_additional', 'zipCode_additional']),
            // } : undefined,         
        };
        await sendPaymentDetails(bookingData);
    };

    // Set additional address
    const addAddress = () => {
        setAdditionalAddress({
            recipientName: '',
            serviceAddress: '',
            city: '',
            state: '',
            zipCode: '',
        });
    };
    
    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ maxWidth: 600, margin: '0 auto', marginTop: '5rem' }}
        >
            <Typography.Title level={3} style={{ textAlign: 'center' }}>
                Booking Details
            </Typography.Title>

            {/* Main Recipient Name */}
            <Form.Item
                label="Recipient Name"
                name="recipientName"
                rules={[{ required: true, message: 'Please enter the recipient name' }]}
            >
                <Input placeholder="Enter recipient name" />
            </Form.Item>

            {/* Main Service Address */}
            <Form.Item
                label="Service Address"
                name="serviceAddress"
                rules={[{ required: true, message: 'Please enter the service address' }]}
            >
                <Input placeholder="Enter service address" />
            </Form.Item>

            {/* Main City */}
            <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: 'Please enter the city' }]}
            >
                <Input placeholder="Enter city" />
            </Form.Item>

            {/* Main State */}
            <Form.Item
                label="State"
                name="state"
                rules={[{ required: true, message: 'Please enter the state' }]}
            >
                <Input placeholder="Enter state" />
            </Form.Item>

            {/* Main Zip Code */}
            <Form.Item
                label="Zip Code"
                name="zipCode"
                rules={[{ required: true, message: 'Please enter the zip code' }]}
            >
                <Input placeholder="Enter zip code" />
            </Form.Item>

            {/* Add additional addresses if the add-on is selected */}
            {selectedAddOns.includes('secondAddress') && additionalAddress && (
                <>
                    <Typography.Title level={5} style={{ marginTop: 20 }}>
                        Additional Recipient/Service Address
                    </Typography.Title>
                    <Form.Item
                        label="Recipient Name"
                        name="recipientName_additional"
                        rules={[{ required: true, message: 'Please enter the recipient name' }]}>
                        <Input placeholder="Enter recipient name" />
                    </Form.Item>

                    <Form.Item
                        label="Service Address"
                        name="serviceAddress_additional"
                        rules={[{ required: true, message: 'Please enter the service address' }]}>
                        <Input placeholder="Enter service address" />
                    </Form.Item>

                    <Form.Item
                        label="City"
                        name="city_additional"
                        rules={[{ required: true, message: 'Please enter the city' }]}>
                        <Input placeholder="Enter city" />
                    </Form.Item>

                    <Form.Item
                        label="State"
                        name="state_additional"
                        rules={[{ required: true, message: 'Please enter the state' }]}>
                        <Input placeholder="Enter state" />
                    </Form.Item>

                    <Form.Item
                        label="Zip Code"
                        name="zipCode_additional"
                        rules={[{ required: true, message: 'Please enter the zip code' }]}>
                        <Input placeholder="Enter zip code" />
                    </Form.Item>
                </>
            )}

            {!additionalAddress && selectedAddOns.includes('secondAddress') && (
                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={addAddress}
                    style={{ width: '100%', marginTop: 10 }}
                >
                    Add Additional Recipient/Service Address
                </Button>
            )}
            {/* Preferred Service Date */}
            <Form.Item
                label="Preferred Service Date"
                name="serviceDate"
                rules={[{ required: true, message: 'Please select the service date' }]}
            >
                <Input type="date" />
            </Form.Item>

            {/* Preferred Time */}
            <Form.Item
                label="Preferred Time (for Rush or Priority Service)"
                name="preferredTime"
                rules={[{ required: true, message: 'Please select/enter preferred time (for Rush or Priority Service)' }]}
            >
                <TimePicker
                    format="hh:mm A"
                    placeholder="Select time"
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item label="Total Price">
                <Typography.Title level={4}>${totalPrice}</Typography.Title>
            </Form.Item>

            {/* Payment Information */}
            <Form.Item
                label="Payment Method"
                name="paymentMethod"
                rules={[{ required: true, message: 'Please select a payment method' }]}
            >
                <Radio.Group
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    value={paymentMethod}
                >
                    <Radio value="creditCard">Credit/Debit Card</Radio>
                    <Radio value="paypal">PayPal</Radio>
                </Radio.Group>
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
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} disabled={loading}>
                        {loading ? <Spin /> : pending ? 'Redirecting to Payment...' : 'Book Now'}
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
