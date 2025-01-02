import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import {
  PrivyProviders,
  WagmiProviders,
  TanstackProviders,
} from '@/components/providers'
import Navbar from '@/components/navbar'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'TakeOff',
  description: 'token.off',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PrivyProviders>
          <TanstackProviders>
            <WagmiProviders>
              <div>
                <Navbar />
                <div className='py-4 pb-24'>{children}</div>
              </div>
            </WagmiProviders>
          </TanstackProviders>
        </PrivyProviders>
      </body>
    </html>
  )
}
