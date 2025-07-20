
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  MessageCircle,
  HelpCircle,
  Building,
  Users,
  Send,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'General inquiries and support',
      contact: 'hello@makna.io',
      action: 'mailto:hello@makna.io'
    },
    {
      icon: Building,
      title: 'Business Support',
      description: 'Help with business registration',
      contact: 'business@makna.io', 
      action: 'mailto:business@makna.io'
    },
    {
      icon: MessageCircle,
      title: 'Quick Questions',
      description: 'Chat with our team',
      contact: 'Available 9 AM - 5 PM',
      action: '#'
    }
  ];

  const quickHelp = [
    {
      icon: HelpCircle,
      title: 'How do I register my business?',
      description: 'Simple 3-step process to get your business listed'
    },
         {
       icon: Users,
       title: 'When will businesses be available?',
       description: 'We\'re onboarding businesses now - sign up to get notified!'
     },
         {
       icon: CheckCircle,
       title: 'What are the platform benefits?',
       description: 'Free setup, easy booking management, and customer reviews'
     }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate form submission - in real app, would send to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16 pb-24">
        <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-afro-orange/10 text-afro-orange border-afro-orange/20 mb-6">
            <MessageCircle className="w-3 h-3 mr-1" />
            Get in Touch
          </Badge>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            We're Here to Help
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about Makna? Need help getting started? We'd love to hear from you 
            and help you join Namibia's new local business community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Methods */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            
            <div className="space-y-4 mb-8">
              {contactMethods.map((method, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-afro-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <method.icon className="w-5 h-5 text-afro-orange" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{method.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                        <a 
                          href={method.action}
                          className="text-sm text-afro-orange hover:text-afro-orange/80 font-medium"
                        >
                          {method.contact}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Office Info */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Our Location</h3>
                    <p className="text-sm text-gray-600">Windhoek, Namibia</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
                    <p className="text-sm text-gray-600">Within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Type */}
                  <div>
                    <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                      What can we help you with?
                    </Label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange"
                    >
                      <option value="general">General Question</option>
                      <option value="business">Business Registration Help</option>
                      <option value="customer">Customer Support</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="feedback">Feedback & Suggestions</option>
                    </select>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Your Name *
                      </Label>
                    <Input 
                      id="name"
                      name="name"
                        type="text"
                      value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="mt-1"
                      required
                    />
                  </div>
                  <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="mt-1"
                      required
                    />
                    </div>
                  </div>
                  
                  {/* Subject */}
                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                      Subject
                    </Label>
                    <Input 
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="How can we help?"
                      className="mt-1"
                    />
                  </div>
                  
                  {/* Message */}
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Message *
                    </Label>
                    <Textarea 
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your question or how we can help..."
                      rows={5}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  {/* Submit */}
                  <Button 
                    type="submit" 
                    className="w-full bg-afro-orange hover:bg-afro-orange/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Sending Message...'
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
                    </CardContent>
                  </Card>
          </div>
        </div>

        {/* Quick Help Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Quick answers to common questions about Makna
            </p>
          </div>
          
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickHelp.map((item, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-afro-orange/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-afro-orange" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
