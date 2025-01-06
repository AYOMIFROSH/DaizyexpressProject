import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FaXmark } from 'react-icons/fa6';

type ServiceType = 'Standard' | 'Rush' | 'Priority';
type ServiceLocation = 'Local' | 'Extended' | 'Rural';
type AdditionalService = 'Stakeout' | 'AddressAttempts' | 'CourtFiling' | 'NotarizedAffidavit';

type FormData = {
  serviceType: ServiceType | '';
  serviceLocation: ServiceLocation | '';
  numDocuments: '1' | '2' | '3+' | '';
  skipTracing: boolean;
  additionalServices: AdditionalService[];
  recipientName: string;
  serviceAddress: string;
  city: string;
  state: string;
  zipCode: string;
  preferredDate: string;
  preferredTime: string;
  paymentMethod: string;
  agreeToTerms: boolean;
  signature: string;
};
interface PaymentOverlayProps {
  onClose?: () => void; // Prop to close the payment overlay
}

const PaymentForm: React.FC <PaymentOverlayProps>= (onClose) => {
  const [formData, setFormData] = useState<FormData>({
    serviceType: '',
    serviceLocation: '',
    numDocuments: '',
    skipTracing: false,
    additionalServices: [],
    recipientName: '',
    serviceAddress: '',
    city: '',
    state: '',
    zipCode: '',
    preferredDate: '',
    preferredTime: '',
    paymentMethod: '',
    agreeToTerms: false,
    signature: '',
  });

  const [totalPrice, setTotalPrice] = useState<number>(0);

  const calculatePrice = (): void => {
    let price = 0;

    switch (formData.serviceType) {
      case 'Standard':
        price += 50;
        break;
      case 'Rush':
        price += 100;
        break;
      case 'Priority':
        price += 200;
        break;
      default:
        break;
    }

    switch (formData.serviceLocation) {
      case 'Local':
        price += 20;
        break;
      case 'Extended':
        price += 50;
        break;
      case 'Rural':
        price += 100;
        break;
      default:
        break;
    }

    if (formData.skipTracing) price += 100;

    formData.additionalServices.forEach((service) => {
      switch (service) {
        case 'Stakeout':
          price += 50;
          break;
        case 'AddressAttempts':
          price += 25;
          break;
        case 'CourtFiling':
          price += 50;
          break;
        case 'NotarizedAffidavit':
          price += 15;
          break;
      }
    });

    setTotalPrice(price);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value, type, ariaChecked } = e.target;
    if (type === 'checkbox' && name === 'additionalServices') {
      setFormData((prev) => ({
        ...prev,
        additionalServices: ariaChecked
          ? [...prev.additionalServices, value as AdditionalService]
          : prev.additionalServices.filter((service) => service !== value),
      }));
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: ariaChecked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    calculatePrice();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full">
      <FaXmark className='h-5 w-5 text-right' onClick={()=> onClose}/>
        <h2 className="text-2xl font-bold mb-4">Document Service Request</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium mb-2">Type of Service:</label>
            <div className="space-y-2">
              {(['Standard', 'Rush', 'Priority'] as ServiceType[]).map((type) => (
                <label className="block" key={type}>
                  <input
                    type="radio"
                    name="serviceType"
                    value={type}
                    onChange={handleChange}
                  />{' '}
                  {type} Service
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Service Location:</label>
            <div className="space-y-2">
              {(['Local', 'Extended', 'Rural'] as ServiceLocation[]).map((location) => (
                <label className="block" key={location}>
                  <input
                    type="radio"
                    name="serviceLocation"
                    value={location}
                    onChange={handleChange}
                  />{' '}
                  {location} Area
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Number of Documents to be Served:</label>
            <div className="space-y-2">
              {(['1', '2', '3+'] as FormData['numDocuments'][]).map((num) => (
                <label className="block" key={num}>
                  <input
                    type="radio"
                    name="numDocuments"
                    value={num}
                    onChange={handleChange}
                  />{' '}
                  {num} Document{num !== '1' && 's'}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Need Skip Tracing?</label>
            <label className="block">
              <input
                type="checkbox"
                name="skipTracing"
                onChange={handleChange}
              />{' '}
              Yes (add $50 - $150)
            </label>
          </div>

          <div>
            <label className="block font-medium mb-2">Additional Services:</label>
            <div className="space-y-2">
              {(['Stakeout', 'AddressAttempts', 'CourtFiling', 'NotarizedAffidavit'] as AdditionalService[]).map((service) => (
                <label className="block" key={service}>
                  <input
                    type="checkbox"
                    name="additionalServices"
                    value={service}
                    onChange={handleChange}
                  />{' '}
                  {service}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Booking Details:</label>
            <input
              type="text"
              name="recipientName"
              placeholder="Recipient Name"
              className="border rounded p-2 w-full"
              onChange={handleChange}
            />
            {/* Additional input fields for address, date, and time go here */}
          </div>

          <div className="text-lg font-bold">Total Price: ${totalPrice}</div>

          <button
            type="submit"
            className="bg-yellow-300 text-white p-3 rounded w-full mt-4 hover:bg-yellow-600"
          >
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
