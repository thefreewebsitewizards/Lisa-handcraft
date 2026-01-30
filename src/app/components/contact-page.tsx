import { Mail, MessageSquare, Send, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to a backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-serif text-foreground mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a custom idea in mind? We'd love to help bring your vision to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl border border-secondary p-8 shadow-lg"
          >
            <h2 className="text-2xl font-serif mb-6 text-foreground">Send us a message</h2>
            
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center"
              >
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                <p className="text-green-700">
                  Thank you for reaching out. We'll get back to you shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm font-bold text-foreground">Your Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Jane Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-bold text-foreground">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="jane@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-foreground">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Custom Order Inquiry"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold text-foreground">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-40 resize-none"
                    placeholder="Tell us about your idea..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-all hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-pink-100">
              <h3 className="text-2xl font-serif mb-6 text-primary">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary p-3 rounded-xl text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 text-foreground">Email Us</h4>
                    <p className="text-muted-foreground text-sm mb-1">For general inquiries & orders:</p>
                    <a href="mailto:batchelorlisa0@gmail.com" className="hover:text-primary hover:underline font-medium text-foreground transition-colors">
                      batchelorlisa0@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-secondary p-3 rounded-xl text-primary">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 text-foreground">Custom Orders</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      We specialize in custom pieces! Send us your inspiration and we'll make it happen.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-secondary/30 rounded-3xl p-8 border border-secondary">
              <h3 className="text-xl font-bold mb-4 font-serif text-foreground">FAQ</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h5 className="font-bold text-primary mb-1">Do you ship nationwide?</h5>
                  <p className="text-muted-foreground text-sm">Yes! We ship anywhere in the US. Shipping is calculated at checkout.</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h5 className="font-bold text-primary mb-1">How long does it take?</h5>
                  <p className="text-muted-foreground text-sm">Ready-to-ship items: 1-2 days. Custom orders: 3-5 business days.</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h5 className="font-bold text-primary mb-1">Returns & Exchanges?</h5>
                  <p className="text-muted-foreground text-sm">Due to the personalized nature of our items, we cannot accept returns unless the item arrives damaged.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
