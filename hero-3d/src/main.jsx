import { Component } from 'react'
import { createRoot } from 'react-dom/client'
import HeroHeader from './HeroHeader'

// Modo depuración: abre el sitio con ?debug en la URL (ej: index.html?debug)
// y los errores aparecen en un panel rojo abajo de la pantalla.
const DEBUG = new URLSearchParams(window.location.search).has('debug')

function showDebug(message) {
  if (!DEBUG) return
  let box = document.getElementById('hero-debug')
  if (!box) {
    box = document.createElement('pre')
    box.id = 'hero-debug'
    box.style.cssText =
      'position:fixed;left:0;right:0;bottom:0;max-height:45vh;overflow:auto;margin:0;padding:12px;' +
      'background:#b00020;color:#fff;font:12px/1.4 monospace;z-index:99999;white-space:pre-wrap'
    document.body.appendChild(box)
  }
  box.textContent += message + '\n\n'
}

if (DEBUG) {
  window.addEventListener('error', (e) => showDebug('window.error: ' + (e.message || e.error)))
  window.addEventListener('unhandledrejection', (e) =>
    showDebug('promesa rechazada: ' + (e.reason?.message || e.reason))
  )
  for (const level of ['error', 'warn']) {
    const original = console[level]
    console[level] = (...args) => {
      showDebug(`console.${level}: ` + args.map((a) => a?.message || String(a)).join(' '))
      original(...args)
    }
  }
}

// Si algo falla en cualquier parte del hero, la página no se rompe
class RootBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error, info) {
    console.error('Error en el hero 3D:', error, info?.componentStack || '')
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

// Monta el header 3D dentro del <header id="hero-3d"> del index.html
const mount = document.getElementById('hero-3d')
if (mount) {
  createRoot(mount).render(
    <RootBoundary>
      <HeroHeader />
    </RootBoundary>
  )
}
