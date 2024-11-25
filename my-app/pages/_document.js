import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="zh-tw" suppressHydrationWarning>
      <Head>
        <meta name="description" content="這是一個小型電商網站" />
        <meta name="keywords" content="咖啡豆" />
        <meta name="author" content="cheyu" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=LXGW+WenKai+Mono+TC&family=Noto+Serif+HK:wght@200..900&display=swap"
          rel="stylesheet"
        ></link>
        <link rel="stylesheet" href="/styles/wickedcss.min.css"></link>

        <link rel="icon" href="/image/favicon.png"></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
