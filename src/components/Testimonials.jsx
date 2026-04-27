import { useContext, useState, useRef } from 'react'
import testimonials from '../data/testimonials'
import { ThemeContext } from '../Context/ThemeContext'

function Testimonials() {
  const { istDunkel } = useContext(ThemeContext)
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const TestimonialCard = ({ testimonial, isActive, isAdjacent }) => {
    return (
      <div className={`
        relative rounded-2xl border p-6 transition-all duration-500 flex flex-col items-center
        ${isActive ? 'w-[450px] opacity-100 scale-100' : 'w-[300px] opacity-40 scale-90 blur-sm'}
        ${isAdjacent && !isActive ? 'hover:opacity-60 hover:blur-none' : ''}
        ${istDunkel
          ? 'bg-[#112240] border-[#233554] hover:border-[#64ffda]'
          : 'bg-white border-gray-200 hover:border-[#0d9488]'
        }
      `}>
        {/* Bild oben */}
        <div className="relative shrink-0">
          <img
            className={`rounded-full object-cover border-2 transition-transform duration-500 hover:scale-105 ${
              isActive ? 'w-20 h-20' : 'w-14 h-14'
            } ${istDunkel ? 'border-[#64ffda]/30' : 'border-[#0d9488]/30'}`}
            alt={testimonial.name}
            src={testimonial.bild}
            onError={(e) => { e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + testimonial.name }}
          />
          <div className={`absolute -bottom-1 -right-1 rounded-full flex items-center justify-center shadow-lg ${
            isActive ? 'w-6 h-6 text-xs' : 'w-5 h-5 text-[10px]'
          } ${istDunkel ? 'bg-[#64ffda] text-[#0a192f]' : 'bg-[#0d9488] text-white'}`}>
            "
          </div>
        </div>

        {/* Name + Rolle */}
        <div className="text-center mt-3">
          <figcaption className={`font-bold ${isActive ? 'text-lg' : 'text-sm'} ${istDunkel ? 'text-white' : 'text-gray-900'}`}>
            {testimonial.name}
          </figcaption>
          <p className={`font-medium ${isActive ? 'text-xs' : 'text-[10px]'} ${istDunkel ? 'text-[#64ffda]' : 'text-[#0d9488]'}`}>
            {testimonial.rolle}
          </p>
        </div>

        {/* Sterne */}
        <div className={`flex gap-1 mt-3 ${isActive ? '' : 'scale-75'}`}>
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${istDunkel ? 'text-[#64ffda]' : 'text-[#0d9488]'}`} viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Text unten */}
        <blockquote className={`mt-4 leading-relaxed italic text-center ${isActive ? 'text-sm' : 'text-xs line-clamp-3'} ${istDunkel ? 'text-[#ccd6f6]' : 'text-gray-600'}`}>
          "{testimonial.text}"
        </blockquote>

        {/* Projekt Tag */}
        <div className="mt-4">
          <span className={`text-[9px] uppercase tracking-[0.15em] font-black px-3 py-1.5 rounded-full border ${
            istDunkel ? 'border-[#233554] text-[#8892b0]' : 'border-gray-100 text-gray-400'
          }`}>
            {testimonial.projekt}
          </span>
        </div>
      </div>
    )
  }

  return (
    <section id="testimonials" className="py-20 px-4">
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h2 className={`text-3xl font-bold mb-2 ${
          istDunkel ? 'text-[#ccd6f6]' : 'text-[#0a192f]'
        }`}>
          Kunden<span className={istDunkel ? 'gradient-text' : 'gradient-text-light'}>stimmen</span>
        </h2>
        <p className={`${istDunkel ? 'text-[#8892b0]' : 'text-[#475569]'}`}>
          Was Kunden über meine Arbeit sagen.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Links Button */}
        <button
          onClick={prevTestimonial}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            istDunkel
              ? 'bg-[#112240] border border-[#233554] text-[#64ffda] hover:border-[#64ffda] hover:shadow-[0_0_20px_rgba(100,255,218,0.3)]'
              : 'bg-white border border-gray-200 text-[#0d9488] hover:border-[#0d9488] hover:shadow-xl'
          }`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Cards Container */}
        <div className="flex items-center justify-center gap-6 py-12" ref={containerRef}>
          {/* Linke Karte */}
          <div
            onClick={prevTestimonial}
            className="cursor-pointer"
          >
            <TestimonialCard
              testimonial={testimonials[(currentIndex - 1 + testimonials.length) % testimonials.length]}
              isActive={false}
              isAdjacent={true}
            />
          </div>

          {/* Mitte Karte (aktiv) */}
          <TestimonialCard
            testimonial={testimonials[currentIndex]}
            isActive={true}
            isAdjacent={false}
          />

          {/* Rechte Karte */}
          <div
            onClick={nextTestimonial}
            className="cursor-pointer"
          >
            <TestimonialCard
              testimonial={testimonials[(currentIndex + 1) % testimonials.length]}
              isActive={false}
              isAdjacent={true}
            />
          </div>
        </div>

        {/* Rechts Button */}
        <button
          onClick={nextTestimonial}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            istDunkel
              ? 'bg-[#112240] border border-[#233554] text-[#64ffda] hover:border-[#64ffda] hover:shadow-[0_0_20px_rgba(100,255,218,0.3)]'
              : 'bg-white border border-gray-200 text-[#0d9488] hover:border-[#0d9488] hover:shadow-xl'
          }`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  )
}

export default Testimonials
