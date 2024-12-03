import "@/public/styles/globals.css";
import Layout from "@/components/layout";
import { Provider } from "@/components/ui/provider";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { CartProvider } from "@/context/CartContext";
import "../public/styles/wickedcss.min.css";


export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Provider>
        <CartProvider>
          <Layout>
            <Head>
              <title>小型電商實作</title>
            </Head>
            <Component {...pageProps} />
          </Layout>
        </CartProvider>
      </Provider>
    </SessionProvider>
  );
}
