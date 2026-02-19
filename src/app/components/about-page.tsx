import { Heart, Package, Sparkles, Star } from 'lucide-react';
import { motion } from 'motion/react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif text-foreground mb-6"
          >
            Crafting Memories, <br/><span className="text-primary italic">One Gift at a Time</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            We believe that the best gifts are the ones that tell a story. 
            Handmade with love, personalized for you.
          </motion.p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-pink-100 rounded-3xl -z-10 rotate-2" />
            <img 
              src="/lisa-about.png" 
              alt="Lisa crafting" 
              className="rounded-2xl shadow-xl w-full object-cover aspect-[4/5]"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif mb-6 text-foreground">Meet Lisa</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Welcome to Lisa's Handmade Gifts! I'm Lisa Batchelor, the hands and heart behind every creation you see here.
              </p>
              <p>
                What started as a small hobby in my craft room has blossomed into a passion for creating meaningful, personalized items that bring joy to people's lives. I realized that in a world of mass-produced items, people were craving something unique—something made just for them.
              </p>
              <p>
                Whether it's a custom tumbler that brightens your morning commute or a personalized plaque that turns a house into a home, my goal is to create pieces that you'll cherish for years to come.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: Heart,
              title: "Made with Love",
              desc: "Every item is handcrafted with obsessive attention to detail and care."
            },
            {
              icon: Sparkles,
              title: "Uniquely Yours",
              desc: "Fully customizable designs that reflect your personal style and story."
            },
            {
              icon: Star,
              title: "Quality First",
              desc: "We use only premium materials to ensure your gifts last a lifetime."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-secondary shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center group"
            >
              <div className="bg-secondary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Offerings */}
        <div className="bg-primary/5 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-serif mb-12">Our Specialties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-2 text-primary">Drinkware</h3>
              <p className="text-muted-foreground">Custom stainless steel tumblers, mugs, and water bottles designed to keep your drinks perfect and look amazing.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-2 text-primary">Home Decor</h3>
              <p className="text-muted-foreground">Hand-painted signs, wooden plaques, and seasonal decorations to add warmth to any space.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-2 text-primary">Personalized Gifts</h3>
              <p className="text-muted-foreground">From bridal party gifts to baby shower presents, we make every occasion extra special with custom details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
