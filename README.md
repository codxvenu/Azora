# Aura – Gift Card Marketplace Design System & Architecture

Aura is a premium, ultra-minimal, high-trust digital marketplace designed for buying and selling gift cards and game keys. Inspired by modern editorial design and Swiss craftsmanship, Aura pairs robust full-stack functionality with a calm, tactile user experience.

---

## 🎨 1. Visual Identity & Aesthetic

### Color Palette
*   **Offwhite Canvas (`#FAF9F6`)**: A warm, slightly yellowish background replacing clinical whites with an organic, eye-friendly, paper-like space.
*   **Coal Dark (`#18181B` / `bg-zinc-900`)**: Deep neutral tones used for strong structural frames (like our hero section) and core action buttons, creating natural typographic hierarchy.
*   **Pure White (`#FFFFFF`)**: Reserved for foreground cards and surface structures to raise content blocks off the page with soft drop shadows.
*   **Accent Emerald (`#16A34A`) & Coral Red (`#EF4444`)**: Highly restrained functional indicators for discount badges, success toasts, and financial transactions.

### Typography pairing
*   **Display Font (Outfit)**: Bold, wide tracking, and modern geometric styling for display headers, logo elements, prices, and high-impact structural blocks.
*   **Body & Utility (Inter)**: Excellent high-legibility sans-serif font optimized for metadata, input states, category tags, and clean navigation buttons.
*   **Core Mono (JetBrains Mono)**: Reserved strictly for codes, key inputs, and terminal-adjacent diagnostic fields.

---

## 📐 2. Structural & Layout Language

### The Half-Roundness Philosophy
During layout iteration, Aura transitioned from overly organic rounded blocks targeting full-pills down to half-radius bounds. This provides a balance between high-end industrial design and premium tech UI:
*   **Outer Structural Wrappers (Hero, Modals)**: Scaled back to `rounded-[1.5rem]` or `rounded-[1.25rem]`.
*   **Actionable Items (Cards, Lists)**: Set elegantly to `rounded-xl` or `rounded-2xl`.
*   **Primary Targets (Buttons, Inputs, Pill Navs)**: Now styled utilizing responsive `rounded-2xl` or `rounded-xl` corners instead of pure circular `rounded-full` lines.

### Responsive Mobile Grid
*   **Double Column Grid (`cols-2`)**: Standard grids are transformed dynamically on mobile to feature **two cards per row**, optimizing view distance and maximizing information density on smaller displays.
*   **Zero Horizontal Overflow**: All container borders are constrained perfectly via fluid grids (`w-full max-w-7xl mx-auto`) to guarantee zero horizontal scroll.

---

## ⚙️ 3. Core Customer Experience & Features

### Smart Expanding Search
The search interface preserves precious aesthetic breathing room:
*   **Icon-only by default**: Measures `48px` of whitespace, keeping the navigation rail tidy.
*   **Interactive Motion**: Smoothly expands to `320px` (or `100%` on mobile) upon click, triggered dynamically by user focus and key inputs, hiding secondary filters when not in demand.

### Product Detail Slide-Up Drawer (`BottomSheet`)
Clicking any card doesn't force a full reload or an intrusive pop-up. Instead, it triggers an elegant overlay:
*   **Damped Spring Physics**: Slides up a card container from the bottom of the viewfinder.
*   **Comprehensive Details**: Presents high-resolution assets, detailed item properties, category tags, interactive "Buy Now" triggers, and shopping add-to-cart slots in a balanced, dual-column structure.

### Multi-Method Deposit Panel (`DepositModal`)
Built to replace browser-level prompt interactions, the custom Deposit container provides direct user choices:
*   **Razorpay**: Formatted for domestic cards and UPI.
*   **Crypto**: Dedicated options to receive USDT/BTC keys directly.
*   **Stripe**: Direct gateway proxy for international cards.
*   **Fluid Increments**: Dynamically queries preferred fund amounts and seamlessly increments wallet balances with real-time UI synchronization.

### Secure Seller Flows (`SellView`)
*   **Instant verification ready**: Clean text area with monospace font styling to enter raw gift codes effortlessly.
*   **Status Logs**: Tracking system for bulk uploads, verification state flags, and estimated credit valuations visible cleanly within personal dashboard panes.

---

## 🛡️ 4. Security & Administration

*   **Secure Escrow Policies**: Transactions are held in escrow with built-in instant verification flows, fully detailed on the interactive landing sections.
*   **Two-Factor Authentication (2FA)**: High-security placeholders to activate 2FA codes, styled inside the responsive account configuration section.
*   **Robust Firestone Rules Configuration**: Complete developer overrides providing permission locks while allowing initial admin accounts (`eafstriker@gmail.com`) to register and securely manage marketplace lists.
