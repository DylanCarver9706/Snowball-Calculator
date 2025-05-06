# Subscription-Based SAAS Application Template

A modern web application built with Next.js that provides PDF utilities with a subscription-based access model.

## Tech Stack

- **Frontend**: Next.js
- **Authentication**: Clerk
- **Payments**: Stripe
- **Analytics**: PostHog

## Getting Started

To use this template for your own project, follow these steps:

1. Clone the repository to your local machine

2. Delete the `.git` directory

3. Create a `.env.local` file in the root directory and add the following environment variables:

   ```
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # PostHog Analytics
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key

   # Stripe Payments
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

   To get these keys:

   - **Clerk**: Go to https://dashboard.clerk.com, click Configure > API Keys to get the publishable and secret keys
   - **PostHog**: Visit https://us.posthog.com, go to Settings > Project Details to get the project API key
   - **Stripe**: Navigate to https://dashboard.stripe.com/test/apikeys to get the publishable and secret keys

4. Install dependencies:

   ```bash
   npm install
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Check for build issues:

   ```bash
   npm run build
   ```

7. Set up your remote repository:
   ```bash
   # First, create a new repository on GitHub.com
   # Then run these commands:
   git init
   git remote add origin https://github.com/username/your-repo-name.git
   git branch -M main
   # Add and commit your code
   git push -u origin main
   ```

## Features

- User authentication and authorization
- Subscription management
- PDF utilities
- Analytics tracking
- Modern, responsive UI

## License

This project is available as a template for building your own SAAS applications.
