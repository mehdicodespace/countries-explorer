import { ref, watch } from 'vue'

const pageTitle = ref('REST Countries API')
const pageDescription = ref('Explore countries around the world with detailed information, flags, and statistics.')
const pageKeywords = ref('countries, world, flags, population, geography, statistics, REST Countries API')

export function useMetadata() {
  const updateMetadata = (title: string, description?: string, keywords?: string) => {
    pageTitle.value = title
    document.title = title
    
    if (description) {
      pageDescription.value = description
    }
    
    if (keywords) {
      pageKeywords.value = keywords
    }
    
    // Update meta tags
    updateMetaTag('description', pageDescription.value)
    updateMetaTag('keywords', pageKeywords.value)
  }

  const updateMetaTag = (name: string, content: string) => {
    let metaTag = document.querySelector(`meta[name="${name}"]`)
    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.setAttribute('name', name)
      document.head.appendChild(metaTag)
    }
    metaTag.setAttribute('content', content)
  }

  // Watch for changes and update document title
  watch(pageTitle, (newTitle) => {
    document.title = newTitle
  })

  return {
    pageTitle,
    pageDescription,
    pageKeywords,
    updateMetadata
  }
}
