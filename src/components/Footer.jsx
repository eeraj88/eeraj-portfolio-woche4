import { useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

function Footer() {
  const { istDunkel } = useContext(ThemeContext)
  const aktuellesJahr = new Date().getFullYear()

  return (
    <footer
      className={`py-8 px-4 border-t ${
        istDunkel ? 'border-gray-700' : 'border-gray-200'
      }`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <p
          className={`text-sm ${
            istDunkel ? 'text-gray-500' : 'text-gray-400'
          }`}
        >
          {aktuellesJahr} Eeraj. Alle Rechte vorbehalten.
        </p>

        <p
          className={`text-xs mt-1 ${
            istDunkel ? 'text-gray-600' : 'text-gray-300'
          }`}
        >
          Gebaut mit React + Tailwind CSS
        </p>
      </div>
    </footer>
  )
}

export default Footer