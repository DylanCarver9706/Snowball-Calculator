# Snowball Calculator - Dave Ramsey Debt Payoff Tool

A beautiful web application for calculating debt payoff using the Dave Ramsey snowball method. Built with Next.js, Material UI, and modern web technologies.

## Features

- **Conversion-Focused Design**: Optimized homepage with multiple CTAs for signup
- **Modern UI**: Sleek Material UI components with Tailwind CSS
- **Authentication**: Secure user authentication with Clerk
- **Analytics**: Basic web traffic analytics with PostHog
- **Responsive**: Mobile-friendly design that works on all devices
- **Educational Content**: Comprehensive resources and guides

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Library**: Material UI (MUI) v5
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Analytics**: PostHog
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Clerk account (for authentication)
- PostHog account (for analytics)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd snowball-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   - Get Clerk keys from [clerk.com](https://clerk.com)
   - Get PostHog key from [posthog.com](https://posthog.com)

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── calculator/        # Calculator page (placeholder)
│   ├── how-it-works/     # Educational content
│   ├── resources/         # Resources and tools
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/            # Reusable components
│   ├── Navbar.tsx        # Navigation component
│   └── PostHogProvider.tsx # Analytics provider
├── public/               # Static assets
└── package.json          # Dependencies
```

## Pages

- **Homepage (`/`)**: Conversion-focused landing page with multiple CTAs
- **How It Works (`/how-it-works`)**: Detailed explanation of the snowball method
- **Resources (`/resources`)**: Educational content and tools
- **Calculator (`/calculator`)**: Placeholder for the actual calculator (to be implemented)

## Customization

### Colors and Theme
The app uses a custom Material UI theme. Edit the theme in `app/layout.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Change primary color
    },
    secondary: {
      main: '#10b981', // Change secondary color
    },
  },
})
```

### Content
- Update homepage content in `app/page.tsx`
- Modify educational content in `app/how-it-works/page.tsx`
- Edit resources in `app/resources/page.tsx`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Next Steps

1. **Implement the Calculator**: Replace the placeholder calculator page with actual functionality
2. **Add Database**: Integrate a database for user data and saved calculations
3. **Enhanced Analytics**: Add custom PostHog events for better tracking
4. **Email Marketing**: Integrate with email service for user engagement
5. **SEO Optimization**: Add meta tags and structured data
6. **Performance**: Implement image optimization and caching

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Note**: This is a conversion-focused application designed to drive user signups. The actual calculator functionality will be implemented separately as mentioned in the project requirements.
