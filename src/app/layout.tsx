import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Product Customizer',
  description: 'Customize your product with our product customizer',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans `}>
        {children}
      
      </body>
    </html>
  )
}
