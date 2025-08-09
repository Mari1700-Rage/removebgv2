// pages/_app.tsx
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [canonicalUrl, setCanonicalUrl] = useState('')

  useEffect(() => {
    const baseUrl = 'https://eraseto.com'
    const cleanPath = router.asPath.split('?')[0] // Strip query params
    setCanonicalUrl(`${baseUrl}${cleanPath}`)
  }, [router.asPath])

  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
 
