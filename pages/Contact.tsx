
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const Contact: React.FC = () => {
  const { settings, addSubmission } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      subject: 'New Contact Form Inquiry',
      source: 'Brightify BD Contact Page'
    };

    try {
      const response = await fetch("https://formspree.io/f/mykyppye", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        addSubmission('contact', formData);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">Have questions about our decor? Our styling experts are here to help you create your dream home.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-violet-100 p-3 rounded-xl text-violet-600">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Phone</h4>
                  <p className="text-slate-600">{settings.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-violet-100 p-3 rounded-xl text-violet-600">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Email</h4>
                  <p className="text-slate-600">{settings.contactEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-violet-100 p-3 rounded-xl text-violet-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Office Address</h4>
                  <p className="text-slate-600">{settings.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 p-8 rounded-3xl h-64 flex items-center justify-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium italic">Interactive Map Placeholder</p>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
          {isSubmitted ? (
            <div className="text-center py-12 flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Message Sent!</h3>
              <p className="text-slate-500 mb-8">We've received your message and will get back to you within 24 hours.</p>
              <button onClick={() => setIsSubmitted(false)} className="text-violet-600 font-bold hover:underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Name</label>
                  <input required type="text" className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-violet-500/20" placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email</label>
                  <input required type="email" className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-violet-500/20" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Phone</label>
                <input required type="tel" className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-violet-500/20" placeholder="01XXXXXXXXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Message</label>
                <textarea required rows={5} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-violet-500/20 resize-none" placeholder="How can we help you?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full bg-violet-600 text-white p-5 rounded-2xl font-bold shadow-lg hover:bg-violet-700 transition-all flex items-center justify-center gap-3">
                {isSubmitting ? <><Loader2 className="animate-spin" /> Sending...</> : <><Send size={20} /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
