import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { useAnimations } from '@react-three/drei'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { LoopOnce } from 'three'

/**
 * Archivos esperados en assets/models/ (descargados de Mixamo, FBX Binary):
 *   - idle.fbx     → personaje CON skin + animación Idle (el cuerpo que se ve)
 *   - waving.fbx   → misma animación "Waving" pero puede ser "Without Skin"
 *
 * Si solo tienes UN archivo, borra `wave` y usa únicamente idle.
 */
export default function Avatar({ active, onToggle, ...props }) {
  const group = useRef()
  const current = useRef('idle')
  const [hovered, setHovered] = useState(false)

  // 1) Cargar los FBX (useLoader los guarda en caché)
  const idleFbx = useLoader(FBXLoader, 'assets/models/idle.fbx')
  const waveFbx = useLoader(FBXLoader, 'assets/models/waving.fbx')

  // 2) Los clips de Mixamo se llaman igual ("mixamo.com"): los renombramos.
  //    Funciona porque ambos comparten el mismo esqueleto (mixamorig...).
  const clips = useMemo(() => {
    const idle = idleFbx.animations[0].clone()
    idle.name = 'idle'
    const wave = waveFbx.animations[0].clone()
    wave.name = 'wave'
    return [idle, wave]
  }, [idleFbx, waveFbx])

  // 3) Un mixer con ambas acciones
  const { actions, mixer } = useAnimations(clips, group)

  // 4) Cambiar de animación con una transición suave (crossfade)
  const play = useCallback(
    (name) => {
      const next = actions[name]
      const prev = actions[current.current]
      if (!next || next === prev) return

      next.reset()
      if (name === 'wave') {
        next.setLoop(LoopOnce, 1) // el saludo se reproduce una sola vez
        next.clampWhenFinished = true
      }
      next.fadeIn(0.3).play()
      prev?.fadeOut(0.3)
      current.current = name
    },
    [actions]
  )

  // 5) Empezar en idle y volver a idle cuando termine el saludo
  useEffect(() => {
    actions.idle?.reset().fadeIn(0.5).play()
    current.current = 'idle'

    const onFinished = (e) => {
      if (e.action === actions.wave) play('idle')
    }
    mixer.addEventListener('finished', onFinished)
    return () => mixer.removeEventListener('finished', onFinished)
  }, [actions, mixer, play])

  // 6) Estado de React → propiedad de la escena (velocidad de animación)
  useEffect(() => {
    if (actions.idle) actions.idle.timeScale = active ? 1.8 : 1
  }, [active, actions])

  // 7) Cursor de mano al pasar el mouse
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered])

  const handleClick = (e) => {
    e.stopPropagation()
    play('wave')
    onToggle?.()
  }

  return (
    <group
      ref={group}
      {...props}
      onClick={handleClick}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
    >
      {/* Mixamo exporta en centímetros → escala 0.01 */}
      <primitive object={idleFbx} scale={0.01} />
    </group>
  )
}
