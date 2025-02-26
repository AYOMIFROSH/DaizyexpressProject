import React, { useState, useRef } from 'react';
import { Form, Input, Button, Checkbox, Typography, Spin, Radio, TimePicker, Modal } from 'antd';
import { useAuth } from '../../Context/useContext';

interface BookingDetailsFormProps {
  onBack: () => void;
  onProceed: (paymentId: string) => void;
  selectedAddOns: string[];
  totalPrice: number;
  selectedService: string | null;
}

const BookingDetailsForm: React.FC<BookingDetailsFormProps> = ({
  onBack,
  onProceed,
  selectedAddOns,
  totalPrice,
  selectedService,
}) => {
  const [form] = Form.useForm();
  const { token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalValues, setModalValues] = useState<any>(null);

  // Use a ref instead of state for form values
  const formValuesRef = useRef<any>(null);

  const Base_Url =
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://daizyexserver.vercel.app';

  const onFinish = (values: any) => {

    setModalValues(values);
    // Store the form values in a ref for immediate access
    formValuesRef.current = values;
    setIsModalVisible(true);
  };

  const handleConfirm = async () => {
    // Close the modal and then proceed with API call
    setIsModalVisible(false);
    const values = formValuesRef.current;
    if (!values) return;
    
    // Build additionalAddresses only if the "secondAddress" add-on is selected
    const additionalAddresses = selectedAddOns.includes('secondAddress')
      ? {
          recipientName: values.recipientName_additional,
          serviceAddress: values.serviceAddress_additional,
          city: values.city_additional,
          state: values.state_additional,
          zipCode: values.zipCode_additional,
        }
      : undefined;

    // (If needed, convert values.preferredTime here before sending; 
    // if your server handles it then this may not be necessary.)

    const bookingData = {
      ...values,
      selectedAddOns,
      totalPrice,
      selectedService,
      additionalAddresses,
    };

    setLoading(true);
    try {
      const response = await fetch(`${Base_Url}/api/payment/create-pending`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error creating pending payment');
      }
      // On success, trigger the next step with the paymentId from the response.
      onProceed(data.paymentId);
    } catch (error) {
      console.error('Error creating pending payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    // Close the modal to allow the user to review or edit the form
    setIsModalVisible(false);
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 600, margin: '0 auto', marginTop: '5rem' }}
      >
        <Typography.Title level={3} style={{ textAlign: 'center' }}>
          Booking Details
        </Typography.Title>

        <Form.Item
          label="Recipient Name"
          name="recipientName"
          rules={[{ required: true, message: 'Please enter the recipient name' }]}
        >
          <Input placeholder="Enter recipient name" />
        </Form.Item>

        <Form.Item
          label="Service Address"
          name="serviceAddress"
          rules={[{ required: true, message: 'Please enter the service address' }]}
        >
          <Input placeholder="Enter service address" />
        </Form.Item>

        <Form.Item
          label="City"
          name="city"
          rules={[{ required: true, message: 'Please enter the city' }]}
        >
          <Input placeholder="Enter city" />
        </Form.Item>

        <Form.Item
          label="State"
          name="state"
          rules={[{ required: true, message: 'Please enter the state' }]}
        >
          <Input placeholder="Enter state" />
        </Form.Item>

        <Form.Item
          label="Zip Code"
          name="zipCode"
          rules={[{ required: true, message: 'Please enter the zip code' }]}
        >
          <Input placeholder="Enter zip code" />
        </Form.Item>

        {selectedAddOns.includes('secondAddress') && (
          <>
            <Typography.Title level={5} style={{ marginTop: 20 }}>
              Additional Recipient/Service Address
            </Typography.Title>
            <Form.Item
              label="Recipient Name"
              name="recipientName_additional"
              rules={[{ required: true, message: 'Please enter the recipient name' }]}
            >
              <Input placeholder="Enter recipient name" />
            </Form.Item>
            <Form.Item
              label="Service Address"
              name="serviceAddress_additional"
              rules={[{ required: true, message: 'Please enter the service address' }]}
            >
              <Input placeholder="Enter service address" />
            </Form.Item>
            <Form.Item
              label="City"
              name="city_additional"
              rules={[{ required: true, message: 'Please enter the city' }]}
            >
              <Input placeholder="Enter city" />
            </Form.Item>
            <Form.Item
              label="State"
              name="state_additional"
              rules={[{ required: true, message: 'Please enter the state' }]}
            >
              <Input placeholder="Enter state" />
            </Form.Item>
            <Form.Item
              label="Zip Code"
              name="zipCode_additional"
              rules={[{ required: true, message: 'Please enter the zip code' }]}
            >
              <Input placeholder="Enter zip code" />
            </Form.Item>
          </>
        )}

        <Form.Item
          label="Preferred Service Date"
          name="serviceDate"
          rules={[{ required: true, message: 'Please select the service date' }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          label="Preferred Time (for Rush or Priority Service)"
          name="preferredTime"
          rules={[{ required: true, message: 'Please select/enter preferred time' }]}
        >
          <TimePicker format="hh:mm A" placeholder="Select time" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Total Price">
          <Typography.Title level={4}>${totalPrice}</Typography.Title>
        </Form.Item>

        <Form.Item
          label="Payment Method"
          name="paymentMethod"
          rules={[{ required: true, message: 'Please select a payment method' }]}
        >
          <Radio.Group>
            <Radio value="creditCard">Credit/Debit Card</Radio>
            <Radio value="paypal">PayPal</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject('You must agree to the terms and conditions'),
            },
          ]}
        >
          <Checkbox>
            I agree to the terms and conditions of DeizyexpressLLC. All payments are due upfront.
          </Checkbox>
        </Form.Item>

        <Form.Item
          label="Signature"
          name="signature"
          rules={[{ required: true, message: 'Please provide your signature' }]}
        >
          <Input placeholder="Enter your signature" />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: 'Please select the date' }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button type="default" htmlType="submit" disabled={!selectedService}>
              {loading ? <Spin /> : 'Review'}
            </Button>
            <Button htmlType="button" style={{ width: '100%' }} onClick={onBack}>
              Back
            </Button>
          </div>
        </Form.Item>
      </Form>

      <Modal
        open={isModalVisible}
        title="Confirm Booking Details"
        onOk={handleConfirm}
        onCancel={handleModalCancel}
        okText="Proceed"
        cancelText="Review"
        centered
        style={{ maxHeight: '95vh', overflowY: 'auto' }}
        width={800}
      >
        <Typography.Paragraph style={{color: 'red', fontWeight: "600"}}>
          Please review your booking details below. If everything looks correct, click "Proceed" to finalize your payment.
        </Typography.Paragraph>
        {modalValues && (
          <div>
            <Typography.Title level={5}>Service Information</Typography.Title>
            <p><strong>Service Selected:</strong> {selectedService}</p>
            <p>
              <strong>Add-Ons:</strong>{' '}
              {selectedAddOns && selectedAddOns.length > 0 ? selectedAddOns.join(', ') : 'None'}
            </p>
            <p><strong>Total Price:</strong> ${totalPrice}</p>

            <Typography.Title level={5} style={{ marginTop: '1rem' }}>
              Booking Information
            </Typography.Title>
            <p><strong>Recipient Name:</strong> {modalValues.recipientName}</p>
            <p><strong>Service Address:</strong> {modalValues.serviceAddress}</p>
            <p><strong>City:</strong> {modalValues.city}</p>
            <p><strong>State:</strong> {modalValues.state}</p>
            <p><strong>Zip Code:</strong> {modalValues.zipCode}</p>

            {selectedAddOns.includes('secondAddress') && (
              <>
                <Typography.Title level={5} style={{ marginTop: '1rem' }}>
                  Additional Address
                </Typography.Title>
                <p><strong>Recipient Name:</strong> {modalValues.recipientName_additional}</p>
                <p><strong>Service Address:</strong> {modalValues.serviceAddress_additional}</p>
                <p><strong>City:</strong> {modalValues.city_additional}</p>
                <p><strong>State:</strong> {modalValues.state_additional}</p>
                <p><strong>Zip Code:</strong> {modalValues.zipCode_additional}</p>
              </>
            )}

            <Typography.Title level={5} style={{ marginTop: '1rem' }}>
              Schedule & Payment
            </Typography.Title>
            <p><strong>Preferred Service Date:</strong> {modalValues.serviceDate}</p>
            <p>
              <strong>Preferred Time:</strong>{' '}
              {modalValues.preferredTime && modalValues.preferredTime.format
                ? modalValues.preferredTime.format("hh:mm A")
                : modalValues.preferredTime}
            </p>
            <p><strong>Payment Method:</strong> {modalValues.paymentMethod}</p>
            <p><strong>Signature:</strong> {modalValues.signature}</p>
            <p><strong>Date:</strong> {modalValues.date}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default BookingDetailsForm;
