'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const CategoryIcon = ({ type }: { type: string }) => {
  const icons = {
    Science: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
        <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6m-6 4h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    History: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Geography: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
        <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Literature: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Movies: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
        <path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Sports: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
        <path d="M12 14l9-5-9-5-9 5 9 5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 14l9-5-9-5-9 5 9 5zm0 0v10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Technology: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Music: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
        <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  };

  return icons[type as keyof typeof icons] || null;
};

const DifficultyIcon = ({ level }: { level: string }) => {
  const icons = {
    Beginner: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Intermediate: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Hard: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8">
        <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  };

  return icons[level as keyof typeof icons] || null;
};

const AnimatedCrossword = () => {
  const words = [
    { word: 'DRIVE', positions: [0, 1, 2, 3, 4], direction: 'across', startDelay: 0 },
    { word: 'RIVER', positions: [1, 8, 15, 22, 29], direction: 'down', startDelay: 1000 },
    { word: 'SOLVE', positions: [12, 13, 14, 15, 16], direction: 'across', startDelay: 2000 }
  ];
  
  const [activeLetters, setActiveLetters] = useState(new Map());
  const gridSize = 6;

  useEffect(() => {
    let isAnimating = true;
    let currentCycle = 0;

    const animateSequence = async () => {
      while (isAnimating) {
        setActiveLetters(new Map());
        await new Promise(resolve => setTimeout(resolve, 1000));

        for (const { word, positions, startDelay } of words) {
          await new Promise(resolve => setTimeout(resolve, startDelay));
          
          for (let i = 0; i < word.length; i++) {
            if (!isAnimating) return;
            
            await new Promise(resolve => setTimeout(resolve, 400));
            setActiveLetters(prev => {
              const updated = new Map(prev);
              updated.set(positions[i], word[i]);
              return updated;
            });
          }
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
        currentCycle++;
      }
    };

    animateSequence();

    return () => {
      isAnimating = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-6 gap-1.5 w-96 h-96 rounded-2xl p-4 bg-white/50 backdrop-blur-sm">
      {Array.from({ length: gridSize * gridSize }).map((_, index) => (
        <div
          key={index}
          className={`
            rounded-lg flex items-center justify-center
            transition-all duration-300 
            shadow-[0_2px_10px_rgba(0,0,0,0.08)]
            ${activeLetters.has(index) 
              ? 'bg-black text-white scale-105 shadow-lg' 
              : 'bg-white shadow-sm'}
          `}
        >
          <span className="text-2xl font-bold">
            {activeLetters.get(index) || ''}
          </span>
        </div>
      ))}
    </div>
  );
};

const CategoryCarousel = () => {
  const categories = [
    'Science', 'History', 'Geography', 'Literature', 
    'Movies', 'Sports', 'Technology', 'Music',
    'Science', 'History', 'Geography', 'Literature', 
    'Movies', 'Sports', 'Technology', 'Music'
  ];
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    const speed = 50;

    const animate = (currentTime: number) => {
      if (!isPaused) {
        const deltaTime = currentTime - lastTime;
        const movement = (speed * deltaTime) / 1000;
        
        setTranslateX(prevTranslate => {
          const newTranslate = prevTranslate - movement;
          if (newTranslate <= -3200) {
            return 0;
          }
          return newTranslate;
        });
      }
      lastTime = currentTime;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <div 
      className="relative group mx-auto max-w-[90vw] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        ref={carouselRef}
        className="flex gap-6 py-8 transition-transform duration-100"
        style={{ 
          transform: `translateX(${translateX}px)`,
          width: 'fit-content' 
        }}
      >
        {categories.map((category, index) => (
          <div
            key={`${category}-${index}`}
            className="flex-none w-72 p-8 rounded-2xl 
              backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.2)]
              bg-black text-white
              transform hover:-translate-y-1
              transition-all duration-500"
          >
            <div className="mb-6">
              <CategoryIcon type={category} />
            </div>
            <h3 className="text-2xl font-bold mb-2">{category}</h3>
            <p className="text-sm opacity-80">
              Explore {category.toLowerCase()}-themed puzzles
            </p>
          </div>
        ))}
      </div>
      
      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </div>
  );
};

const gridPattern = {
  backgroundImage: 'linear-gradient(90deg,rgba(0,0,0,.03) 1px,transparent 0),linear-gradient(180deg,rgba(0,0,0,.03) 1px,transparent 0)',
  backgroundSize: '40px 40px'
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={gridPattern}>
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-black/5">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">CrosswordGPT</Link>
          <div className="flex gap-8 items-center">
            <Link href="#categories" className="hover:opacity-70 transition-opacity">Categories</Link>
            <Link 
              href="/puzzle" 
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all duration-300"
            >
              Start Playing
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white opacity-50" />
        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="pl-12 space-y-8">
              <h1 className="text-7xl font-bold leading-tight">
                AI Crossword
                <br />
                <span className="text-8xl bg-gradient-to-r from-black via-gray-700 to-black text-transparent bg-clip-text">
                  Puzzle
                </span>
              </h1>
              <p className="text-xl text-gray-600">
                Play cool AI-powered crossword puzzles based on your interests and skill level.
              </p>
              <Link 
                href="/puzzle"
                className="inline-flex items-center gap-3 bg-black text-white px-12 py-6 rounded-xl
                  text-xl font-bold hover:bg-gray-900 transition-all duration-300
                  transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Create Your Puzzle
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-radial from-white via-transparent to-transparent z-10" />
              <AnimatedCrossword />
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white opacity-50" />
        <div className="container mx-auto px-4 relative">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-black via-gray-700 to-black text-transparent bg-clip-text">
            Choose Your Category
          </h2>
          <CategoryCarousel />
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-black via-gray-700 to-black text-transparent bg-clip-text">
            Select Difficulty
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { level: 'Beginner', desc: 'Perfect for newcomers with friendly clues and simpler words' },
              { level: 'Intermediate', desc: 'Challenge yourself with more complex patterns and vocabulary' },
              { level: 'Hard', desc: 'Master-level puzzles for the truly dedicated solver' }
            ].map(({ level, desc }) => (
              <div
                key={level}
                className="p-8 rounded-2xl cursor-pointer backdrop-blur-sm
                  shadow-[0_8px_30px_rgb(0,0,0,0.2)]
                  transform -translate-y-1
                  bg-black text-white
                  transition-all duration-300"
              >
                <div className="mb-6">
                  <DifficultyIcon level={level} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{level}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white opacity-50" />
        <div className="container mx-auto px-4 relative max-w-3xl text-center">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-black via-gray-700 to-black text-transparent bg-clip-text">
            Ready to Start Playing?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Experience the next generation of crossword puzzles. Our AI creates unique puzzles tailored 
            to your interests, making every solving session engaging and enjoyable.
          </p>
          <div className="inline-flex gap-8">
            <Link 
              href="/puzzle"
              className="bg-black text-white px-8 py-4 rounded-xl
                font-semibold hover:bg-gray-800 transition-all duration-300
                transform hover:-translate-y-1 shadow-lg hover:shadow-xl
                text-lg"
            >
              Create Your First Puzzle
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}