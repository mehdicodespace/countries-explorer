# REST Countries API Challenge

A modern Vue 3 application that displays country information from the REST Countries API with advanced search and filtering capabilities.

## 🚀 Live Demo

[View Live Demo](https://your-demo-url.com) <!-- Replace with your actual deployment URL -->

## ✨ Features

- **🌍 Country Browser** - Browse all countries with detailed information
- **🔍 Smart Search** - Instant search with exact matching and fuzzy fallback for typos (e.g., "Grmany" finds "Germany")
- **🌎 Region Filtering** - Filter countries by region (Africa, Americas, Asia, Europe, Oceania)
- **📊 Advanced Sorting** - Optional sorting with separate dropdowns for sort field (Name/Population) and sort order (Ascending/Descending)
- **🌙 Dark/Light Mode** - Toggle between light and dark themes
- **📱 Responsive Design** - Optimized for mobile and desktop
- **🎨 Clear UI Labels** - Intuitive labels with icons for all filter controls (clickable for accessibility)
- **♻️ Reusable Components** - DRY principle with shared form components (SearchInput, DropdownInput)
- **🔗 URL Synchronization** - Filters stored in URL query strings for sharing and bookmarking
- **⚡ Performance** - Lazy loading for images and efficient client-side filtering
- **🎯 Type Safety** - Full TypeScript support throughout

## 🛠️ Tech Stack

- **Vue 3** - Composition API with TypeScript
- **Pinia** - State management
- **Vue Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first styling
- **Headless UI** - Accessible components
- **Font Awesome** - Professional icon library
- **Fuse.js** - Fuzzy search implementation
- **Axios** - HTTP client
- **Vite** - Build tool

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vue3-countries-challenge.git

# Navigate to project directory
cd vue3-countries-challenge

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## 📁 Project Structure

```
src/
├── api/                 # API layer
│   ├── config.ts       # Axios configuration
│   └── countries.ts    # Countries API functions
├── components/         # Vue components
│   ├── country/        # Country-specific components
│   └── ui/            # Reusable UI components
│       ├── forms/     # Form input components
│       └── ...        # Other UI components
├── stores/            # Pinia stores
│   ├── countries.ts   # Countries state management
│   └── theme.ts       # Theme state management
├── types/             # TypeScript type definitions
├── views/             # Page components
└── assets/            # Static assets
```

## 🎯 Key Features Implementation

### Smart Search with Hybrid Matching
- Instant exact substring matching for fast, accurate results
- Falls back to fuzzy search only for typo tolerance
- Uses Fuse.js with strict threshold (0.4) for typo detection
- Works immediately on any character input
- Example: "Iran" finds Iran instantly, "Grmany" finds "Germany" via fuzzy
- Lightning-fast, precise search experience

### Advanced Filtering & Sorting
- All countries loaded once and cached
- Instant search, filter, and sort results
- No API calls for filtering operations
- Separate sort field (Name/Population) and sort order (Ascending/Descending) dropdowns

### Lazy Loading
- Country flags load only when visible
- Efficient image loading with `loading="lazy"`
- Optimized performance for large datasets

### Modern Vue 3 Patterns
- Composition API with `<script setup>`
- `defineModel()` for clean v-model implementation
- Reactive state management with Pinia
- Type-safe development with TypeScript

## 🏆 Bonus Features Implemented

- ✅ **Fuzzy Search** - Typo-tolerant search functionality
- ✅ **Lazy Loading** - Images and smart list rendering
- ✅ **4:3 Flag Ratio** - Proper aspect ratio for country flags
- ✅ **Dark/Light Mode** - Theme switching without external libraries

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build the project
npm run build

# Deploy dist folder to Netlify
```

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 API Integration

This project integrates with the [REST Countries API v3.1](https://restcountries.com/):

- **Base URL**: `https://restcountries.com/v3.1`
- **Fields**: `name,flags,population,region,capital,cca3`
- **Caching**: 5-minute stale time with Vue Query

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [REST Countries API](https://restcountries.com/) for providing country data
- [Vue.js](https://vuejs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Headless UI](https://headlessui.com/) for accessible components