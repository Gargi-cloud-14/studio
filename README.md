⚒️ Pixel & Forge:
 
 The Artisan’s Digital HubPixel & Forge is a next-generation hybrid marketplace that bridges the gap between tangible craftsmanship and digital innovation. It is a full-stack e-commerce solution built to handle the unique workflows of creators who sell both physical goods (The Forge) and digital assets (The Pixel) in a single, unified experience.
 
 🎯 The Problem & The SolutionThe Problem: 
 
 Most platforms are "single-lane." Shopify is great for physical boxes; Gumroad is great for PDFs. Creators selling both often face fragmented inventories, double the fees, and a disconnected customer experience.The Innovation: Pixel & Forge uses a "Smart-Logic" checkout system. It dynamically adjusts the UI and backend fulfillment based on the product's DNA—switching from shipping logistics to secure, time-limited download tokens in one click.
 
 ✨ Unique Features
 
 🕒 Time-Tiered Digital Access
 
 Unlike static download links, our "Pixel" assets feature Custom Expiry Windows. At checkout, users can select access durations (e.g., 15m, 1h, 24h). The backend automatically revokes access after the timer hits zero, protecting creator IP.
 
 🛡️ Secure FulfillmentForge Logic:
 
  Automatically triggers shipping workflows and address validation for physical items.Pixel Logic: Generates secure, server-side signed URLs only after Stripe payment confirmation.
  
  ⚡ Performance First
  
  Built on Next.js 15, the site achieves near-instant load times through server-side rendering (SSR) and optimized image delivery, ensuring the artisan's work is displayed in high-fidelity.
  
  🛠️ Tech Stack & Infrastructure
  
  Layer          Technology          Purpose
  Frontend       Next.js 15/React    High-performance SPA with App Router.
  Styling        Tailwind CSS        Minimalist, "Artisan-Modern" UI design.
  Database       MongoDB Atlas       Flexible schema for hybrid product types.
  Payments       Stripe API          Secure, PCI-compliant payment processing.
  Hosting        Vercel              Global edge deployment and CI/CD.
  Security       JWT & Webhooks      Protecting digital assets and verifying orders.
  
  🚀 Getting Started (Local Development)
  
  Clone & Enter:
  Bash
  git clone https://github.com/Gargi-cloud-14/studio.git
  cd studio

Install Engines:

Bash

npm install

Environment Setup:

Create a .env.local and add  your:

MONGODB_URI
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

Ignite:

Bash

npm run dev

📸 Project Showcase

Home: A minimalist gallery of handcrafted and digital works.
Smart Checkout: Dynamic address forms that hide/show based on cart metadata.
Dashboard: Secure user area with real-time countdown timers for digital downloads.

Developed by Gargi Ghosh. Looking to push the boundaries of e-commerce? Let's connect.