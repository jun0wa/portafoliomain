import { createRoot } from 'react-dom/client'
import HeroHeader from './HeroHeader'

// Monta el header 3D dentro del <header id="hero-3d"> del index.html
const mount = document.getElementById('hero-3d')
if (mount) createRoot(mount).render(<HeroHeader />)
