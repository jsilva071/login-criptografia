import { Html, Head, Main, NextScript } from 'next/document'
import { ColorSchemeScript } from '@mantine/core'

export default function Document() {
  return (
    <Html lang="pt">
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="description" content="Teste" />
      </Head>
      <ColorSchemeScript defaultColorScheme="auto" localStorageKey="mantine-ui-color-scheme" />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
