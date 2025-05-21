
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <div className="pt-16 pb-12">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-afro-blue to-afro-teal text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg opacity-90">
              Have questions or feedback? We'd love to hear from you!
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <p className="text-muted-foreground mb-6">
                  Fill out the form and our team will get back to you as soon as possible.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Sending Message...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" /> Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Email</h3>
                          <p className="text-sm text-muted-foreground mt-1">For general inquiries:</p>
                          <a href="mailto:hello@afrobizconnect.com" className="text-primary hover:underline">
                            hello@afrobizconnect.com
                          </a>
                          <p className="text-sm text-muted-foreground mt-1">For business support:</p>
                          <a href="mailto:support@afrobizconnect.com" className="text-primary hover:underline">
                            support@afrobizconnect.com
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Phone</h3>
                          <p className="text-sm text-muted-foreground mt-1">Monday to Friday, 8:00 AM - 5:00 PM</p>
                          <a href="tel:+264 61 123 4567" className="text-primary hover:underline">
                            +264 61 123 4567
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Office</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            123 Independence Avenue<br />
                            Windhoek, Namibia
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="mt-8">
                    <h3 className="font-medium mb-3">Follow Us</h3>
                    <div className="flex space-x-4">
                      <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <Facebook className="h-5 w-5 text-primary" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <Twitter className="h-5 w-5 text-primary" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                        <Instagram className="h-5 w-5 text-primary" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mb-8">
              Find answers to common questions about AfroBiz Connect.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">How do I list my business on AfroBiz Connect?</h3>
                <p className="text-muted-foreground">
                  You can list your business by creating an account and filling out the business 
                  registration form. Once submitted, our team will review your information and 
                  approve your listing within 1-2 business days.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">Is AfroBiz Connect free to use?</h3>
                <p className="text-muted-foreground">
                  AfroBiz Connect is free for customers to browse, search, and book services. For 
                  businesses, we offer both free and premium listing options with different features 
                  and visibility.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">How do I make a booking through the platform?</h3>
                <p className="text-muted-foreground">
                  Simply search for the business you're interested in, select the service you want, 
                  choose your preferred date and time, and confirm your booking. You'll receive a 
                  confirmation email with all the details.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">Can I cancel or reschedule a booking?</h3>
                <p className="text-muted-foreground">
                  Yes, you can cancel or reschedule bookings through your account. Please note that 
                  each business may have different cancellation policies, which will be displayed 
                  during the booking process.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Don't see your question here? <a href="#" className="text-primary hover:underline">Check our full FAQ</a> or contact us directly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
