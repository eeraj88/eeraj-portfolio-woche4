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

  const aktuellesTestimonial = testimonials[aktuellerIndex]

  return (
    <section id="testimonials" className={`py-20 px-4 ${
      istDunkel ? 'bg-gray-800/30' : 'bg-white'
    }`}>
      <div className="max-w-4xl mx-auto">
        <h2 className={`text-3xl font-bold mb-2 text-center ${
          istDunkel ? 'text-white' : 'text-gray-900'
        }`}>
          Was <span className="gradient-text">Kunden</span> sagen
        </h2>

        <p className={`text-center mb-12 ${
          istDunkel ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Vertrauen von Weltklasse-Persoenlichkeiten
        </p>

        {/* Testimonial Card */}
        <div className={`relative rounded-2xl p-8 md:p-12 transition-all duration-500 ${
          istDunkel 
            ? 'bg-gray-900/70 border border-gray-700/50' 
            : 'bg-gray-50 border border-gray-200'
        }`}>
          
          {/* Quote Icon */}
          <div className="absolute top-6 left-6 text-6xl opacity-20 gradient-text font-serif">
            "
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Projekt Badge */}
            <div className="mb-6">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                istDunkel 
                  ? 'bg-orange-500/20 text-orange-400' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {aktuellesTestimonial.projekt}
              </span>
            </div>

            {/* Text */}
            <p className={`text-lg md:text-xl leading-relaxed mb-8 ${
              istDunkel ? 'text-gray-300' : 'text-gray-700'
            }`}>
              "{aktuellesTestimonial.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <img 
                src={aktuellesTestimonial.bild} 
                alt={aktuellesTestimonial.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-orange-500"
              />
              <div>
                <h4 className={`font-bold text-lg ${
                  istDunkel ? 'text-white' : 'text-gray-900'
                }`}>
                  {aktuellesTestimonial.name}
                </h4>
                <p className={`text-sm ${
                  istDunkel ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {aktuellesTestimonial.rolle}
                </p>
              </div>

              {/* Stars */}
              <div className="ml-auto flex gap-1">
                {[...Array(aktuellesTestimonial.bewertung)].map((_, i) => (
                  <span key={i} className="text-orange-400 text-xl">★</span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={vorheriges}
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              istDunkel 
                ? 'bg-gray-800 hover:bg-orange-500 text-white border border-gray-700 hover:border-orange-500' 
                : 'bg-white hover:bg-orange-500 text-gray-800 hover:text-white border border-gray-300 hover:border-orange-500 shadow-lg'
            }`}
            aria-label="Vorheriges Testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={naechstes}
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              istDunkel 
                ? 'bg-gray-800 hover:bg-orange-500 text-white border border-gray-700 hover:border-orange-500' 
                : 'bg-white hover:bg-orange-500 text-gray-800 hover:text-white border border-gray-300 hover:border-orange-500 shadow-lg'
            }`}
            aria-label="Naechstes Testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === aktuellerIndex
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 w-8'
                  : istDunkel 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-300 hover:bg-gray-400'
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
