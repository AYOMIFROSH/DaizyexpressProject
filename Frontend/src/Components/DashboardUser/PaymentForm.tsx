import React, { useState } from 'react';
import { Form, Checkbox, Card, Typography, Divider, Button } from 'antd';

interface ServiceFormProps {
  onProceed: (selectedAddOns: string[], selectedService: string | null, totalPrice: number) => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ onProceed }) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const services = [
    {
      value: 'Standard Process Serving',
      label: 'Standard Process Serving',
      price: 75,
      details: 'Includes 4-6 service attempts, proof of service with GPS and photo evidence. Coverage: Anywhere in Texas.',
    },
    {
      value: 'Comprehensive Concierge Service',
      label: 'Comprehensive Concierge Service',
      price: 85,
      details: 'Includes e-filing the case, serving the citation, and e-filing the return of service.',
    },
    {
      value: 'Rush Service',
      label: 'Rush Service',
      price: 140,
      details: 'Expedited first attempt (within 24 hours), multiple follow-up attempts, and proof of service.',
    },
    {
      value: 'Same-Day Service',
      label: 'Same-Day Service',
      price: 160,
      details: 'First attempt within 12 hours, unlimited attempts until successful, GPS and photo evidence.',
    },
    {
      value: 'Skip Tracing (Locate Missing Individuals)',
      label: 'Skip Tracing (Locate Missing Individuals)',
      price: 35,
      details: 'Comprehensive research to find the individual’s most recent address or contact information.',
    },
    {
      value: 'Document Filing Only',
      label: 'Document Filing Only',
      price: 45,
      details: 'Includes e-filing and delivery to court with confirmation of submission.',
    },
    {
      value: 'Court Document Retrieval',
      label: 'Court Document Retrieval',
      price: 50,
      details: 'Locating and retrieving court documents on behalf of the client.',
    },
    {
      value: 'Affidavit of Non-Service',
      label: 'Affidavit of Non-Service',
      price: 20,
      details: 'Official documentation of failed attempts to serve.',
    },
  ];
  

  const addOns = [
    { value: 'extraAttempts', label: 'Additional Attempts Beyond Standard Package - $10/attempt', price: 10 },
    { value: 'secondAddress', label: 'Second Address Attempt - $15', price: 15 },
    { value: 'notarization', label: 'Notarized Proof of Service - $15', price: 15 },
  ];

  const handleServiceSelect = (value: string) => {
    setSelectedService(selectedService === value ? null : value);
  };

  const handleAddOnChange = (checkedValues: any[]) => {
    setSelectedAddOns(checkedValues);
  };

  const getTotalPrice = () => {
    const servicePrice = services.find(service => service.value === selectedService)?.price || 0;
    const addOnsPrice = selectedAddOns.reduce((total, addOn) => {
      const addOnPrice = addOns.find(add => add.value === addOn)?.price || 0;
      return total + addOnPrice;
    }, 0);
    return servicePrice + addOnsPrice;
  };

  const handleProceed = () => {
    const totalPrice = getTotalPrice();
    onProceed(selectedAddOns, selectedService, totalPrice);
  };

  return (
    <Form layout="vertical" style={{ marginTop: '5.5rem'}}>
      {/* Service Type Selection */}
      <Form.Item label="SELECT SERVICE TYPE">
        <div className="flex gap-4 flex-wrap">
          {services.map(service => (
            <Card
              key={service.value}
              hoverable
              className={`w-72 cursor-pointer ${selectedService === service.value ? 'border-2 border-blue-500' : 'border border-gray-300'} hover:border-blue-500 transition-all`}
              onClick={() => handleServiceSelect(service.value)}
            >
              <Typography.Title level={5}>{service.label}</Typography.Title>
              <Typography.Text>${service.price}</Typography.Text>
              <Divider />
              <Typography.Paragraph>{service.details}</Typography.Paragraph>
            </Card>
          ))}
        </div>
      </Form.Item>

      {/* Additional Services */}
      <Form.Item label="Additional Services">
        <Checkbox.Group onChange={handleAddOnChange}>
          {addOns.map(addOn => (
            <Checkbox key={addOn.value} value={addOn.value}>
              {addOn.label}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Form.Item>

      {/* Pricing Summary */}
      <Card title="Pricing Summary" bordered>
        <Typography.Text>
          Base Service Price: ${services.find(service => service.value === selectedService)?.price || 0}
        </Typography.Text>
        <br />
        <Typography.Text>
          Add-Ons: $
          {selectedAddOns.reduce((total, addOn) => {
            const addOnPrice = addOns.find(add => add.value === addOn)?.price || 0;
            return total + addOnPrice;
          }, 0)}
        </Typography.Text>
        <Divider />
        <Typography.Title level={4}>
          Total: ${getTotalPrice()}
        </Typography.Title>
      </Card>

      {/* Proceed Button */}
      <Button
        type="primary"
        className="mt-4"
        onClick={handleProceed}
        disabled={!selectedService}
      >
        Proceed
      </Button>
    </Form>
  );
};

export default ServiceForm;
