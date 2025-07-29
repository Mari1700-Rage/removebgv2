import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document'

class MyDocument extends Document<{ nonce?: string }> {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)

    // Optional: you can try to extract nonce from headers if passed
    return {
      ...initialProps,
    }
  }

  render() {
    // Optional: use `this.props.nonce` if you're passing it from middleware or server
    return (
      <Html lang="en">
        <Head>
          {/* Example of an inline script using a nonce */}
          <script
            nonce={(this.props as any).nonce}
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript nonce={(this.props as any).nonce} />
        </body>
      </Html>
    )
  }
}

export default MyDocument
