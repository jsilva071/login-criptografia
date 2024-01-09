import '@mantine/core/styles.css'
import { MantineProvider, createTheme } from '@mantine/core'

import type { AppProps } from 'next/app'

import './globals.css'

const theme = createTheme({
  fontFamily: 'Raleway, sans-serif',
  primaryColor: 'dark',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <Component {...pageProps} />
    </MantineProvider>
  )
}
