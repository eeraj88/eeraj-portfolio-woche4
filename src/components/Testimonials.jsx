import { useState, useContext } from 'react'
import testimonials from '../data/testimonials'
import { ThemeContext } from '../Context/ThemeContext'

function Testimonials() {
  const { istDunkel } = useContext(ThemeContext)
  const [aktuellerIndex, setAktuellerIndex] = useState(0)

  const naechstes = () => {
    setAktuellerIndex((prev) => (prev + 1) % testimonials.length)
  }

  const vorheriges = () => {
    setAktuellerIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Get prev, current, next indices (wrapping around)
  const getIndex = (offset) => {
    return (aktuellerIndex + offset + testimonials.length) % testimonials.length
  }

  const prevTestimonial = testimonials[getIndex(-1)]
  const currentTestimonial = testimonials[aktuellerIndex]
  const nextTestimonial = testimonials[getIndex(1)]

  // Card component for reusability
  const TestimonialCard = ({ testimonial, position }) => {
    const isCenter = position === 'center'
    const isLeft = position === 'left'
    const isRight = position === 'right'

    return (
      <div 
        onClick={() => {
          if (isLeft) vorheriges()
          if (isRight) naechstes()
        }}
        className={`
          relative rounded-2xl p-6 md:p-8 transition-all duration-500 
          ${isCenter ? 'z-20' : 'z-10 cursor-pointer'}
          ${isCenter ? 'scale-100 opacity-100' : 'scale-[0.85] opacity-60'}
          ${!isCenter ? 'blur-[2px] hover:blur-[1px] hover:opacity-75' : ''}
          ${istDunkel 
            ? 'bg-[#112240] border border-[#233554]' 
            : 'bg-white border border-[#e2e8f0] shadow-lg'
          }
        `}
        style={{
          minWidth: isCenter ? '100%' : '280px',
          maxWidth: isCenter ? '100%' : '320px',
        }}
      >
        {/* Quote Icon - only on center */}
        {isCenter && (
          <div className={`absolute top-4 left-4 text-5xl opacity-30 font-serif ${
            istDunkel ? 'text-[#64ffda]' : 'text-[#0d9488]'
          }`}>
            "
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {/* Projekt Badge */}
          <div className="mb-4">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              istDunkel 
                ? 'bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/30' 
                : 'bg-[#0d9488]/10 text-[#0d9488] border border-[#0d9488]/30'
            }`}>
              {testimonial.projekt}
            </span>
          </div>

          {/* Text - truncated for side cards */}
          <p className={`leading-relaxed mb-6 ${
            istDunkel ? 'text-[#8892b0]' : 'text-[#475569]'
          } ${isCenter ? 'text-lg md:text-xl' : 'text-sm line-clamp-3'}`}>
            "{isCenter ? testimonial.text : testimonial.text.slice(0, 100) + '...'}"
          </p>

          {/* Author */}
          <div className="flex items-center gap-3">
            <img 
              src={testimonial.bild} 
              alt={testimonial.name}
              className={`rounded-full object-cover border-2 ${
                istDunkel ? 'border-[#64ffda]' : 'border-[#0d9488]'
              } ${isCenter ? 'w-14 h-14' : 'w-10 h-10'}`}
            />
            <div className="flex-1 min-w-0">
              <h4 className={`font-bold truncate ${
                istDunkel ? 'text-[#ccd6f6]' : 'text-[#0a192f]'
              } ${isCenter ? 'text-lg' : 'text-sm'}`}>
                {testimonial.name}
              </h4>
              <p className={`truncate ${
                istDunkel ? 'text-[#8892b0]' : 'text-[#475569]'
              } ${isCenter ? 'text-sm' : 'text-xs'}`}>
                {testimonial.rolle}
              </p>
            </div>

            {/* Stars - only on center */}
            {isCenter && (
              <div className="flex gap-0.5">
                {[...Array(testimonial.bewertung)].map((_, i) => (
                  <span key={i} className={`text-lg ${istDunkel ? 'text-[#64ffda]' : 'text-[#0d9488]'}`}>★</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <section id="testimonials" className="py-20 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-3xl font-bold mb-2 text-center ${
          istDunkel ? 'text-[#ccd6f6]' : 'text-[#0a192f]'
        }`}>
          Was <span className={istDunkel ? 'gradient-text' : 'gradient-text-light'}>Kunden</span> sagen
        </h2>

        <p className={`text-center mb-12 ${
          istDunkel ? 'text-[#8892b0]' : 'text-[#475569]'
        }`}>
          Vertrauen von Weltklasse-Persoenlichkeiten
        </p>

        {/* 3-Card Carousel */}
        <div className="relative flex items-center justify-center gap-4 md:gap-6">
          
          {/* Left Card (Previous) - Hidden on mobile */}
          <div className="hidden md:block flex-shrink-0 w-72">
            <TestimonialCard testimonial={prevTestimonial} position="left" />
          </div>

          {/* Center Card (Current) */}
          <div className="w-full max-w-2xl flex-shrink-0">
            <TestimonialCard testimonial={currentTestimonial} position="center" />
          </div>

          {/* Right Card (Next) - Hidden on mobile */}
          <div className="hidden md:block flex-shrink-0 w-72">
            <TestimonialCard testimonial={nextTestimonial} position="right" />
          </div>

          {/* Navigation Arrows - Visible on mobile */}
          <button
            onClick={vorheriges}
            className={`md:hidden absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-30 ${
              istDunkel 
                ? 'bg-[#112240] hover:bg-[#64ffda] text-[#ccd6f6] hover:text-[#0a192f] border border-[#233554]' 
                : 'bg-white hover:bg-[#0d9488] text-[#0a192f] hover:text-white border border-[#e2e8f0] shadow-lg'
            }`}
            aria-label="Vorheriges Testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={naechstes}
            className={`md:hidden absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-30 ${
              istDunkel 
                ? 'bg-[#112240] hover:bg-[#64ffda] text-[#ccd6f6] hover:text-[#0a192f] border border-[#233554]' 
                : 'bg-white hover:bg-[#0d9488] text-[#0a192f] hover:text-white border border-[#e2e8f0] shadow-lg'
            }`}
            aria-label="Naechstes Testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setAktuellerIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === aktuellerIndex
                  ? istDunkel 
                    ? 'bg-[#64ffda] w-7' 
                    : 'bg-[#0d9488] w-7'
                  : istDunkel 
                    ? 'bg-[#233554] hover:bg-[#8892b0]' 
                    : 'bg-[#e2e8f0] hover:bg-[#cbd5e1]'
              }`}
              aria-label={`Testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
