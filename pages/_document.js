import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function() {
                // https://www.joshwcomeau.com/react/dark-mode/
                // alert('runs before page render on client every time')
                function getTheme() {
                  const persistedTheme = window.localStorage.getItem('theme');
                  const hasTheme = typeof persistedTheme === 'string';

                  // localStorage theme
                  if (hasTheme) {
                    // console.log('localStorage theme', persistedTheme)
                    return persistedTheme;
                  }

                  // mediaQuery theme
                  const mql = window.matchMedia('(prefers-color-scheme: dark)');
                  const hasMediaQueryTheme = typeof mql.matches === 'boolean';
                  if (hasMediaQueryTheme) {
                    const mediaQueryTheme = mql.matches ? 'dark' : 'light';
                    // console.log('mediaQuery theme', mediaQueryTheme)
                    return mediaQueryTheme;
                  }

                  // default theme
                  // console.log('default theme', persistedTheme)
                  return 'dark';
                }

                const theme = getTheme();
                const root = document.documentElement;

                theme === 'dark'
                  ? root.classList.add("dark")
                  : root.classList.remove("dark");
              })()`,
            }}
          ></script>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
