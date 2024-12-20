import { useEffect, useRef } from 'react'

export function MainSlider({ children, title }) {
  const itemsContainerRef = useRef(null)
  const leftGradientRef = useRef(null)
  const rightGradientRef = useRef(null)

  const updateGradients = () => {
    const itemsContainer = itemsContainerRef.current
    const leftGradient = leftGradientRef.current
    const rightGradient = rightGradientRef.current

    if (!itemsContainer || !leftGradient || !rightGradient) return

    const { scrollLeft, scrollWidth, clientWidth } = itemsContainer

    // Ocultar gradiente izquierdo si estamos al inicio
    leftGradient.classList.toggle('opacity-0', scrollLeft === 0)

    // Ocultar gradiente derecho si estamos al final
    const isAtEnd = Math.abs(scrollWidth - clientWidth - scrollLeft) < 1
    rightGradient.classList.toggle('opacity-0', isAtEnd)
  }

  useEffect(() => {
    const itemsContainer = itemsContainerRef.current
    if (itemsContainer) {
      itemsContainer.addEventListener('scroll', updateGradients)
      // Verificar gradientes iniciales
      updateGradients()
    }

    return () => {
      if (itemsContainer) {
        itemsContainer.removeEventListener('scroll', updateGradients)
      }
    }
  }, [])

  return (
    <div className="flex flex-col gap-4">
      {title && (
        <h2 className="text-2xl font-bold pl-3">{title}</h2>
      )}
      <div className="relative" id="slider-container">
        <div 
          ref={leftGradientRef}
          className="absolute left-0 top-0 h-full w-[45px] z-10 opacity-100 transition-opacity duration-300" 
        />
        <div 
          ref={rightGradientRef}
          className="absolute right-0 top-0 h-full w-[45px] z-10 opacity-100 transition-opacity duration-300" 
        />
        <div 
          ref={itemsContainerRef}
          className="flex items-center overflow-x-auto gap-1 pb-4 scrollbar-hide"
        >
          {children}
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  )
} 