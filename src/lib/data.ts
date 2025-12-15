
import type { Product, Order } from './types';
import data from './placeholder-images.json';

type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

const placeholderImages: ImagePlaceholder[] = data.placeholderImages;

export function getPlaceholderImage(id: string): ImagePlaceholder | undefined {
  return placeholderImages.find(img => img.id === id);
}

export const products: Product[] = [
  {
    id: 'prod_001',
    name: 'Leather Bound Journal',
    description: 'A beautifully handcrafted journal with 200 unlined pages, perfect for sketching or writing. The leather is sustainably sourced and develops a rich patina over time.',
    price: 45.00,
    isDigital: false,
    imageId: 'leather-journal',
    specs: {
      'Pages': '200',
      'Size': 'A5 (5.8 x 8.3 inches)',
      'Cover': 'Genuine Leather',
      'Paper': '120gsm acid-free',
    }
  },
  {
    id: 'prod_002',
    name: 'Minimalist Website Template',
    description: 'A clean, modern, and fully responsive template for Framer. Perfect for portfolios, blogs, and small businesses. Includes documentation and customer support.',
    price: 79.00,
    isDigital: true,
    imageId: 'website-template',
    specs: {
      'Platform': 'Framer',
      'Responsive': 'Yes',
      'Pages': 'Home, About, Portfolio, Contact',
      'CMS Ready': 'Yes',
    }
  },
  {
    id: 'prod_003',
    name: 'Artisan Ceramic Mug',
    description: 'A unique, hand-thrown ceramic mug with a speckled glaze. Each piece is one-of-a-kind. Holds 12oz of your favorite beverage. Microwave and dishwasher safe.',
    price: 32.00,
    isDigital: false,
    imageId: 'ceramic-mug',
    specs: {
      'Capacity': '12 oz',
      'Material': 'Stoneware Clay',
      'Care': 'Microwave & Dishwasher Safe',
      'Origin': 'Handmade in-house',
    }
  },
  {
    id: 'prod_004',
    name: 'Pro Icon Set',
    description: 'A set of 500+ professional, minimalist line icons for your design projects. Provided in SVG, and Figma file formats for easy customization.',
    price: 25.00,
    isDigital: true,
    imageId: 'icon-set',
    specs: {
      'Count': '500+ Icons',
      'Formats': 'SVG, Figma',
      'Style': 'Minimalist Line',
      'License': 'Commercial Use',
    }
  },
  {
    id: 'prod_005',
    name: 'Abstract Art Print',
    description: 'A high-quality giclée print of an original abstract painting. Printed on archival matte paper for a long-lasting, vibrant finish. Frame not included.',
    price: 60.00,
    isDigital: false,
    imageId: 'art-print',
     specs: {
      'Size': '16x20 inches',
      'Paper': 'Archival Matte Paper',
      'Ink': 'Pigment-based',
      'Edition': 'Open',
    }
  },
  {
    id: 'prod_006',
    name: 'Artisan Font Bundle',
    description: 'A curated bundle of three unique, handcrafted fonts: a serif, a sans-serif, and a script. Perfect for branding, invitations, and elegant designs.',
    price: 49.00,
    isDigital: true,
    imageId: 'font-bundle',
     specs: {
      'Includes': '3 Font Families',
      'Formats': 'OTF, WOFF, WOFF2',
      'License': 'Desktop & Web',
      'Characters': 'Full Latin Pro',
    }
  },
  {
    id: 'prod_007',
    name: 'Cinematic Photo Presets',
    description: 'A collection of 10 premium presets for Adobe Lightroom (Desktop & Mobile) to give your photos a professional, cinematic look with a single click.',
    price: 29.00,
    isDigital: true,
    imageId: 'photo-presets',
     specs: {
      'Count': '10 Presets',
      'Compatibility': 'Lightroom Desktop & Mobile',
      'Format': '.XMP & .DNG',
      'Guide': 'Installation PDF included',
    }
  },
  {
    id: 'prod_008',
    name: 'Carved Wooden Coasters',
    description: 'Set of four coasters, carved from solid walnut wood with a geometric pattern. Each coaster is finished with a natural oil to protect against moisture.',
    price: 38.00,
    isDigital: false,
    imageId: 'wooden-coaster',
     specs: {
      'Quantity': 'Set of 4',
      'Material': 'Solid Walnut',
      'Diameter': '4 inches',
      'Finish': 'Natural Oil',
    }
  },
];
