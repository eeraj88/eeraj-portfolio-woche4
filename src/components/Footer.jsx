import { useContext } from 'react'
import { ThemeContext } from '../Context/ThemeContext'

function Footer() {
  const { istDunkel } = useContext(ThemeContext)
  const aktuellesJahr = new Date().getFullYear()

  return (
    <footer className={`py-10 px-4 border-t ${
      istDunkel ? 'border-gray-800' : 'border-gray-200'
    }`}>
      <div className="max-w-4xl mx-auto text-center">
        <p className={`text-lg font-semibold mb-2 ${
          istDunkel ? 'text-white' : 'text-gray-900'
        }`}>
          <span className="gradient-text">Eeraj</span>.dev
        </p>

        <p className={`text-sm mb-4 ${
          istDunkel ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Frontend Developer in Ausbildung
        </p>

        <div className={`text-xs ${
          istDunkel ? 'text-gray-600' : 'text-gray-400'
        }`}>
          <p>&copy; {aktuellesJahr} Eeraj. Alle Rechte vorbehalten.</p>
          <p className="mt-1">Gebaut mit React + Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
