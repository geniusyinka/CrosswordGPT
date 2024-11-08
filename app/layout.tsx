import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'
import Footer from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <React.StrictMode>
            {children}
            <Footer />
        </React.StrictMode>
      </body>
    </html>
  )
}