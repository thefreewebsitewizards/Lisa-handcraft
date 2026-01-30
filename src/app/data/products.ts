import { Product } from '@/app/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Sparkly Valentine\'s Tumbler',
    category: 'drinkware',
    price: 24.99,
    description: 'Beautiful 12 oz stainless steel tumbler with red sparkly design. Perfect for Valentine\'s Day! Includes lid, straw, and straw cleaner. Optional name personalization available.',
    images: [
      'https://images.unsplash.com/photo-1704663198277-f3671defb217?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMHR1bWJsZXIlMjBjdXAlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3Njk3NzE2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1683818051102-dd1199d163b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjB0dW1ibGVyJTIwZGVzaWduc3xlbnwxfHx8fDE3Njk3NzE2MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    variants: [
      {
        id: 'size',
        name: 'Size',
        options: ['12 oz'],
      },
    ],
    allowsPersonalization: true,
    inStock: true,
    isMadeToOrder: false,
    tags: ['tumbler', 'valentine', 'sparkly', 'personalized', 'gift'],
  },
  {
    id: '2',
    name: 'Animal Lovers Tumbler',
    category: 'drinkware',
    price: 29.99,
    description: '20 oz stainless steel tumbler perfect for animal lovers. Features adorable pet designs. Keeps hot drinks hot and cold drinks cold. Includes lid and straw.',
    images: [
      'https://images.unsplash.com/photo-1704663198277-f3671defb217?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMHR1bWJsZXIlMjBjdXAlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3Njk3NzE2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    variants: [
      {
        id: 'size',
        name: 'Size',
        options: ['20 oz'],
      },
    ],
    allowsPersonalization: true,
    inStock: true,
    isMadeToOrder: true,
    tags: ['tumbler', 'animals', 'pets', 'personalized'],
  },
  {
    id: '3',
    name: 'Breast Cancer Awareness Tumbler',
    category: 'drinkware',
    price: 29.99,
    description: '20 oz stainless steel tumbler with pink ribbons and hearts design. Show your support with this beautiful awareness tumbler. Can be duplicated if sold out.',
    images: [
      'https://images.unsplash.com/photo-1683818051102-dd1199d163b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjB0dW1ibGVyJTIwZGVzaWduc3xlbnwxfHx8fDE3Njk3NzE2MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    variants: [
      {
        id: 'size',
        name: 'Size',
        options: ['20 oz'],
      },
    ],
    allowsPersonalization: true,
    inStock: true,
    isMadeToOrder: true,
    tags: ['tumbler', 'awareness', 'cancer', 'charity', 'pink'],
  },
  {
    id: '4',
    name: 'GO DAWGS Fan Tumbler',
    category: 'drinkware',
    price: 29.99,
    description: '20 oz Georgia Bulldogs fan tumbler. Perfect for game days! Show your team spirit with this custom designed tumbler. Can be duplicated if sold out.',
    images: [
      'https://images.unsplash.com/photo-1704663198277-f3671defb217?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMHR1bWJsZXIlMjBjdXAlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3Njk3NzE2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    variants: [
      {
        id: 'size',
        name: 'Size',
        options: ['20 oz'],
      },
    ],
    allowsPersonalization: false,
    inStock: true,
    isMadeToOrder: true,
    tags: ['tumbler', 'sports', 'georgia', 'bulldogs', 'fan'],
  },
  {
    id: '5',
    name: 'Fur Parent Wall Plaque',
    category: 'home-decor',
    price: 34.99,
    description: 'Charming painted gray wooden plaque perfect for pet owners. Features a hook for a lint roller and comes with a roller included. Custom pet name available. A great conversation starter!',
    images: [
      'https://images.unsplash.com/photo-1760067537888-5c7f1f255eca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBwbGFxdWUlMjBob21lJTIwZGVjb3J8ZW58MXx8fHwxNzY5NzcxNjMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1765946024844-2906c9749eff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGdpZnRzJTIwcGVyc29uYWxpemVkfGVufDF8fHx8MTc2OTc3MTYzMnww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    variants: [
      {
        id: 'color',
        name: 'Color',
        options: ['Gray'],
      },
    ],
    allowsPersonalization: true,
    inStock: true,
    isMadeToOrder: false,
    tags: ['plaque', 'wood', 'pets', 'personalized', 'decor', 'functional'],
  },
  {
    id: '6',
    name: 'Custom Name Tumbler',
    category: 'personalized',
    price: 27.99,
    description: 'Fully personalized 20 oz tumbler with custom name design. Choose your favorite colors and make it uniquely yours!',
    images: [
      'https://images.unsplash.com/photo-1683818051102-dd1199d163b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjB0dW1ibGVyJTIwZGVzaWduc3xlbnwxfHx8fDE3Njk3NzE2MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    variants: [
      {
        id: 'size',
        name: 'Size',
        options: ['20 oz'],
      },
    ],
    allowsPersonalization: true,
    inStock: true,
    isMadeToOrder: true,
    tags: ['tumbler', 'personalized', 'custom', 'name'],
  },
];
