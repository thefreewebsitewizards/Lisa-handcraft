import { motion } from 'motion/react';

export function Marquee() {
  return (
    <section className="bg-primary py-4 overflow-hidden border-t border-pink-400/20">
      <div className="flex w-full">
        <motion.div 
          animate={{ x: "-50%" }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex whitespace-nowrap min-w-full"
        >
          {/* Repeated content for seamless loop - 2 sets of identical long content */}
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="flex items-center gap-8 text-white font-serif text-xl md:text-2xl font-bold tracking-widest uppercase mr-8">
                  Custom Made <span className="text-pink-200">•</span> Personalized Gifts <span className="text-pink-200">•</span> Handcrafted with Love <span className="text-pink-200">•</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
