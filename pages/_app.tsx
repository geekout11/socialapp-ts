import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NextNProgress from "nextjs-progressbar";

const App = ({ Component, pageProps }: AppProps) => {
  const [isSSR, setIsSSR] = useState(true)

  useEffect(() => {
    setIsSSR(false);
  }, [])

  if (isSSR) {
    return null
  }
  return (
    <>
      <NextNProgress options={{ showSpinner: false }} color="#F51997" startPosition={0.3} stopDelayMs={200} height={3} showOnShallow={true} />
      <GoogleOAuthProvider clientId={`${process.env.NEXT_PUBLIC_GOOGLE_API_TOKEN}`}>
        <div className='xl:w-[1200px] m-auto overflow-hidden h-[100vh]'>
          <Navbar />
          <div className='flex'>
            <div className='h-[92vh] overflow-hidden hl:hover:overflow-auto'>
              <Sidebar />
            </div>
            <div className='mt-4 flex flex-col gap-10 overflow-auto h-[88vh] videos flex-1'>
              <Component {...pageProps} />
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  )
}

export default App;