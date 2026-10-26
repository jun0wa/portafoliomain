import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * Cubo flotante:
 *  - useFrame: rota y "flota" (se modifica el ref, NO el estado).
 *  - Hover: se agranda. Click: alterna color y escala (estado de React).
 *  - `active` viene del padre (se activa al hacer click en el avatar).
 */
export default function FloatingShape({ position, color, active }) {
  const mesh = useRef()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state, delta) => {
    if (!mesh.current) return
    const speed = active ? 2 : 1
    mesh.current.rotation.x += delta * 0.6 * speed
    mesh.current.rotation.y += delta * 0.8 * speed
    mesh.current.position.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.2
  })

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        scale={hovered ? 1.4 : clicked ? 1.8 : 1}
        onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => (e.stopPropagation(), setClicked((c) => !c))}
      >
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial
          color={clicked ? '#f472b6' : active ? '#facc15' : color}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
    </group>
  )
}
