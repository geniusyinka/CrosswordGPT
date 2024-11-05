// app/page.tsx
import Link from 'next/link';

export default function LandingPage() {
    return (
      <main className="bg-white">
        <nav className="bg-black text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">AI Crossword Puzzle</h1>
          </div>
        </nav>
  
        <section className="container mx-auto py-20 text-center">
          <h2 className="text-5xl font-bold mb-6">Challenge Your Mind with AI</h2>
          <p className="text-xl text-gray-700 mb-12">Discover an AI-powered crossword puzzle experience that adapts to your skill level</p>
          
          {/* New Play Button Section */}
          <div className="mb-20">
            <Link 
              href="/puzzle" 
              className="group relative inline-flex items-center justify-center"
            >
              <div className="absolute -inset-0.5 bg-black rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-200"></div>
              <button className="relative bg-white text-black px-12 py-6 rounded-lg border-2 border-black text-2xl font-bold
                hover:bg-black hover:text-white transition-all duration-200 transform hover:scale-105
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none
                flex items-center gap-3"
              >
                Play Crossword Puzzle
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </Link>
          </div>
        </section>
  
        <section id="features" className="bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-500">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 border border-gray-200 rounded-lg hover:border-black transition-colors duration-200">
                <h3 className="text-xl font-bold mb-4 text-gray-500">Adaptive Difficulty</h3>
                <p className="text-gray-700">Our AI adjusts the puzzle's difficulty based on your progress, ensuring a challenging experience.</p>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg hover:border-black transition-colors duration-200">
                <h3 className="text-xl font-bold mb-4 text-gray-500">Interactive Hints</h3>
                <p className="text-gray-700">Get helpful hints without spoiling the fun, as the AI provides tailored clues to guide you.</p>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg hover:border-black transition-colors duration-200">
                <h3 className="text-xl font-bold mb-4 text-gray-500">User-Friendly Interface</h3>
                <p className="text-gray-700">Enjoy an intuitive interface designed for seamless puzzle-solving experiences.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
}