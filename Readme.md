# 🌍 REST Countries API - Vue.js Challenge

> **📝 Documentation Disclaimer**: This README documentation has been enhanced with AI assistance solely for improved readability, organization, and professional presentation.

## 🚀 Live Demo

**[View Live Demo](https://mehdicodecom.github.io/vue3-countries-challenge/)**  
**URL**: https://mehdicodecom.github.io/vue3-countries-challenge/

## 🛠️ Tech Stack

- **Vue 3.5.22** - Composition API with TypeScript
- **TypeScript 5.9.0** - Type-safe development
- **Tailwind CSS 4.1.14** - Latest version with enhanced performance
- **Vite 7.1.7** - Lightning-fast build tool
- **Pinia 3.0.3** - Modern state management
- **Vue Router 4.5.1** - Client-side routing
- **TanStack Vue Query 5.90.5** - Data fetching and caching
- **Axios 1.12.2** - HTTP client
- **Font Awesome 7.1.0** - Icon library
- **Headless UI Vue 1.7.23** - Accessible UI components _(used limitedly as project wasn't large, but included as mentioned in job requirements)_

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/mehdicodecom/vue3-countries-challenge.git

# Navigate to project directory
cd vue3-countries-challenge

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ✨ Features Implemented

### 🎯 Core Requirements

- ✅ **Country Listing** - Display all countries from REST Countries V2 API
- ✅ **Search Functionality** - Real-time search with fuzzy matching
- ✅ **Region Filtering** - Filter countries by continent/region
- ✅ **Country Details** - Detailed view with comprehensive information
- ✅ **Client-side Routing** - Seamless navigation between pages
- ✅ **Border Countries** - Clickable border country links

### 🎨 UI/UX Features

- ✅ **Responsive Design** - Mobile-first approach with desktop optimization
- ✅ **Dark/Light Theme** - Custom theme switcher without 3rd party libraries
- ✅ **Dynamic Page Titles** - SEO-optimized titles and meta descriptions
- ✅ **Loading States** - Elegant loading spinners and error handling
- ✅ **Image Optimization** - Lazy loading with fallback images
- ✅ **Accessibility** - ARIA labels and keyboard navigation

### 🔧 Advanced Features

- ✅ **State Management** - Pinia stores for countries and theme
- ✅ **Data Caching** - TanStack Query for efficient API calls
- ✅ **Type Safety** - Full TypeScript implementation
- ✅ **URL Sync** - Filter states synchronized with URL query parameters
- ✅ **Sort Functionality** - Sort by population and country name
- ✅ **Fuzzy Search** - Advanced search with Fuse.js integration

## 🏆 Bonus Points Completed

### ✅ Implemented Bonuses

- 🎨 **Custom Theme Toggle** - Built without 3rd party libraries
- 🔍 **Advanced Search** - Fuzzy search supporting typos (e.g., "Grmany", "Grmny")
- 📊 **Sort Functionality** - Sort by Population and Country Name
- 🖼️ **Flag Ratio Optimization** - 4:3 aspect ratio for country flags
- 🔗 **URL Query Sync** - Filters stored in URL query strings
- ⚡ **Lazy Loading** - Images and list virtualization for performance
- 🚀 **CI/CD Pipeline** - Automated deployment with GitHub Actions

### ⏰ Not Implemented (Time Constraints)

- ❌ **Server-Side Rendering** - Not implemented due to project requirements
- ❌ **Unit Tests** - Comprehensive testing suite needs more development time

#### Reasons for Not Implementing SSR:

- **Time Constraints**: 48-hour deadline with current work commitments (7 AM - 5 PM on-site) limited development time
- **Technical Architecture**: Pure Vue 3 SSR requires custom server setup and build configuration, while frameworks like Nuxt 3 provide built-in SSR capabilities and would be more suitable for production SSR implementation

> **Note**: Both features could be implemented with additional time allocation. The focus was on delivering a fully functional, production-ready application within the given timeframe.

## 🚀 Deployment

This project is automatically deployed to **GitHub Pages** using GitHub Actions:

- **Trigger**: Push to main branch
- **Build Process**: Automated npm install → build → deploy
- **URL**: `https://mehdicodecom.github.io/vue3-countries-challenge/`
- **HTTPS**: Automatically enabled
- **CDN**: Global content delivery network

## 🏗️ Project Structure

```
src/
├── api/           # API configuration and services
├── components/    # Reusable Vue components
├── composables/   # Vue 3 composables (useMetadata, etc.)
├── stores/        # Pinia state management
├── types/         # TypeScript type definitions
├── views/         # Page components
└── assets/        # Static assets and styles
```

## 🎯 Key Technical Decisions

- **Tailwind CSS 4.x**: Latest version with improved performance and no config required
- **TanStack Query**: Modern data fetching with caching and background updates
- **Headless UI**: Accessible components without styling constraints
- **TypeScript**: Full type safety across the application
- **Composition API**: Modern Vue 3 patterns for better code organization

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

This is a challenge submission. For any questions or feedback, please reach out through the provided contact channels.

---

**Built with ❤️ by Mehdi Rafiei** | **Vue.js Challenge Submission**
