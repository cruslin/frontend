'use client';

import { useState } from 'react';
import SectionWrapper from '@/components/ui/SectionWrapper';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { cith } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { FadeIn } from '@/components/ui/Motion';
import { Home, CheckCircle } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function RegisterHubContent() {
  const [formData, setFormData] = useState({
    address: '',
    area: '',
    city: '',
    state: '',
    capacity: '',
    preferredDay: '',
    preferredTime: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { success, error } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address || !formData.area || !formData.city || !formData.state || !formData.preferredDay || !formData.preferredTime) {
      error('Please fill in all required fields');
      return;
    }
    setIsLoading(true);

    try {
      await cith.applyHub({
        address: formData.address,
        area: formData.area,
        city: formData.city,
        state: formData.state,
        preferredDay: formData.preferredDay,
        preferredTime: formData.preferredTime,
        capacity: formData.capacity ? Number(formData.capacity) : undefined,
      });
      setIsSuccess(true);
      success('Your hub application has been submitted!');
    } catch (err) {
      error('Failed to submit application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-80 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-dark via-purple to-purple-vivid"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
        <div className="relative z-10 text-center px-4">
          <div className="flex justify-center mb-4">
            <Home className="w-16 h-16 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-white drop-shadow-md mb-4">
            Register Your Home as a Hub
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-body">
            Open your home to build kingdom community
          </p>
        </div>
      </section>

      {/* Registration Form */}
      <SectionWrapper variant="off-white">
        <FadeIn>
          <div className="max-w-2xl mx-auto">
            {isSuccess ? (
              <div className="bg-[#E8E6F0] border-2 border-[#27AE60] rounded-lg p-12 text-center">
                <CheckCircle className="w-16 h-16 text-[#27AE60] mx-auto mb-4" />
                <h2 className="text-3xl font-heading font-bold text-[#0E0B1E] mb-2">
                  Application Submitted!
                </h2>
                <p className="text-[#8A8A90] font-body">
                  We've received your hub application. Our team will review it and reach out soon to discuss next steps.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold font-heading text-[#0E0B1E] mb-8 text-center">
                    Hub Application Form
                  </h2>
                </div>

                <Input
                  label="Street Address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Area / Neighbourhood"
                    name="area"
                    type="text"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="e.g. Lekki Phase 1"
                    required
                  />
                  <Input
                    label="City"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Your city"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="State"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Your state"
                    required
                  />
                  <Input
                    label="Capacity (optional)"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="Max number of people"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-heading font-semibold text-[#0E0B1E] mb-2">
                      Preferred Meeting Day <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="preferredDay"
                      value={formData.preferredDay}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-[#E8E6F0] rounded-lg font-body text-[#0E0B1E] focus:outline-none focus:border-[#C9A84C] transition-colors bg-white"
                    >
                      <option value="">Select a day</option>
                      {days.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <Input
                    label="Preferred Meeting Time"
                    name="preferredTime"
                    type="text"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    placeholder="e.g. 6:00 PM"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#C9A84C] hover:bg-[#0E0B1E] text-white font-heading font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            )}
          </div>
        </FadeIn>
      </SectionWrapper>
    </main>
  );
}

export default function RegisterHubPage() {
  return (
    <ProtectedRoute>
      <RegisterHubContent />
    </ProtectedRoute>
  );
}
