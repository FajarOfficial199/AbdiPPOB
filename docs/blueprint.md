# **App Name**: Abdi Pratama PPOB

## Core Features:

- One-Page Guest Checkout: Streamlined flow for purchasing Pulsa, Data, PLN, and Game Vouchers without requiring user account registration.
- QRIS Payment Integration: Dynamic display of a standard QRIS payment interface (using provided asset: https://i.imgur.com/IvVcoBz.png) with a secure proof-of-payment upload system.
- AI Proof Validator Tool: Uses a vision tool to analyze uploaded payment receipts, automatically suggesting approval status to admins based on transaction amount and merchant matching.
- Comprehensive Admin Dashboard: Secure management interface for product pricing, category toggling, and manual transaction verification with real-time stats.
- Live Order Status Tracking: A dedicated landing status page where customers can monitor their transaction progress via a unique link generated post-checkout.
- Relational Data Storage: Scalable MySQL-ready database architecture to handle transaction history, product stock, and audit logs.
- SEO & Performance Engine: Automated meta title and description generation optimized for high-speed server-side rendering with Next.js.

## Style Guidelines:

- Primary color: Vibrant Tech Blue (#2563EB) to evoke trust and reliability.
- Background color: Soft Arctic Grey (#F8FAFC) for a clean, professional financial interface.
- Accent color: Success Green (#16A34A) used for price indicators and successful transaction statuses.
- Body and Headline font: 'Inter' used throughout for its modern, machined, and neutral aesthetic suitable for data-heavy apps.
- Sharp, geometric line icons representing different utility categories (Lightbulb for PLN, Joystick for Games, etc.).
- A mobile-first, single-column dashboard layout on small screens, expanding to a professional card grid for desktop view.
- Subtle skeleton loaders during data fetching and smooth fade transitions when moving between the payment and confirmation steps.