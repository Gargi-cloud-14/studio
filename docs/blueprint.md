# **App Name**: Pixel & Forge

## Core Features:

- Product Browsing: Allow users to browse both digital and physical products with detailed descriptions, images, and pricing.
- Product Details: Dedicated pages to showcase each product with detailed specifications.
- Smart Checkout: Dynamically show or hide the shipping address form based on the cart content (digital vs. physical items).
- Shopping Cart: Users can add products to their cart.
- Stripe Payment Integration: Process payments using Stripe's Payment Intent API.
- Order Tracking: Enable users to track their order status. Includes status updates sent using Sendgrid on new status transitions (new, processing, shipped, etc.).
- Protected Digital Downloads: Secure digital downloads that are only accessible to logged-in users after successful payment verification using the Firestore database.

## Style Guidelines:

- Primary color: Warm brown (#A67B5B) reminiscent of leather and wood, fitting with an artisan marketplace.
- Background color: Off-white (#F2F0EB), offering a clean and unobtrusive backdrop that puts focus on product imagery and reinforces the minimalist aesthetic.
- Accent color: Soft gold (#D4AC0D) for highlighting key actions, such as 'Add to Cart' or 'Buy Now,' complementing the color scheme and hinting to precious metals from forging.
- Headline font: 'Playfair', serif font; Body font: 'PT Sans', sans-serif font.
- Use simple line icons for navigation and interactive elements.
- Minimalist design with plenty of whitespace.
- Subtle animations, like fading or sliding effects, to create smooth transitions.