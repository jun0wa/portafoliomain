import { Component, Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sparkles, useProgress } from '@react-three/drei'
import Avatar from './Avatar'
import FloatingShape from './FloatingShape'

const shapes = [
  { position: [-2.5, 0.8, -1], color: '#38bdf8' },
  { position: [-1.2, -0.8, 0], color: '#a78bfa' },
  { position: [0.2, 1.3, -1.5], color: '#34d399' },
]

// Si el modelo falla al cargar, solo se oculta el avatar (el resto del header
// sigue visible) y el motivo se muestra en la consola del navegador (F12).
class ModelBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error) {
    console.error('No se pudo cargar el modelo 3D:', error)
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

// true cuando la pantalla es < 768px (breakpoint "md" de Bootstrap)
function useIsMobile() {
  const query = '(max-width: 767.98px)'
  const [mobile, setMobile] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e) => setMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return mobile
}

// Indicador de carga (HTML normal, fuera del Canvas)
function Loader() {
  const { active, progress } = useProgress()
  if (!active) return null
  return (
    <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 small text-white-50" style={{ zIndex: 20 }}>
      Loading model… {Math.round(progress)}%
    </div>
  )
}

export default function HeroHeader() {
  const [active, setActive] = useState(false) // estado compartido React <-> 3D
  const mobile = useIsMobile()

  return (
    // La altura la define el <header id="hero-3d"> del index.html
    <section className="position-relative overflow-hidden h-100">
      {/* CAPA 3D (fondo) */}
      <div className="position-absolute top-0 start-0 w-100 h-100">
        <Canvas camera={{ position: [0, 0, mobile ? 6 : 5], fov: 40 }} dpr={[1, 2]}>
          {/* Luces */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <pointLight
            position={[-3, 2, 2]}
            intensity={30}
            color={active ? '#f59e0b' : '#38bdf8'}
          />

          <ModelBoundary>
            <Suspense fallback={null}>
              <Avatar
                position={mobile ? [0, -1.9, 0] : [1.6, -1.0, 0]}
                active={active}
                onToggle={() => setActive((a) => !a)}
              />
            </Suspense>
          </ModelBoundary>

          {shapes.map((s, i) => (
            <FloatingShape key={i} {...s} active={active} />
          ))}

          <Sparkles count={60} scale={8} size={3} speed={0.4} />

          {/* Órbita restringida */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.8}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
          />
        </Canvas>
      </div>

      <Loader />

      {/* CAPA HTML (encima del canvas) con clases de Bootstrap.
          pe-none = los clics atraviesan el texto y llegan al canvas;
          pe-auto = los botones sí reciben clics. */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 pe-none d-flex flex-column justify-content-start justify-content-md-center pt-5 pt-md-0"
        style={{ zIndex: 10 }}
      >
        <div className="container px-5">
          <p className="fs-5 text-info mb-1">Hi, I'm</p>
          <h1 className="display-3 fw-bold text-white mb-2">Juan Esteban Castro</h1>
          <p className="fs-4 text-white-50 mb-4 col-md-6">
            Multimedia Engineering student. Front-end and 3D for the web.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <a href="#modules" className="btn btn-primary btn-lg rounded-pill pe-auto">
              View projects
            </a>
            <a
              href="https://github.com/jun0wa"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-light btn-lg rounded-pill pe-auto"
            >
              GitHub
            </a>
          </div>
          <p className="small text-white-50 mt-4 mb-0 d-none d-md-block">Click the avatar to make it dance.</p>
        </div>
      </div>
    </section>
  )
}
