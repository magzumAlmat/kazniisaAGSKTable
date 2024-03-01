import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import { GoogleAnalytics } from '@next/third-parties/google'

import ReduxProvider from "@/store/provider";
import ThemeProviderWrapper from "@/store/themeProvider";
import Footer from "@/components/footer";
import Header from "@/components/header";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  // userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
}

export const metadata = {
  
  title: "Volokno",
  description: "Volokno",
  verification: {
    google: "Qmi_pB30aPPO__Ht7NT-D8VY8E8xKifhiMwMRybaur4",
  },
  
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <Head>
        {/*  */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0"
        />
         <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16464823771"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments)}
              gtag('js', new Date());

              gtag('config', 'AW-16464823771');
            `
          }}
        />
      </Head>
      
      <ReduxProvider>
        <body>
          <ThemeProviderWrapper>
            <Header />
            <main>{children}</main>
            <Footer />
          </ThemeProviderWrapper>
        </body>
      </ReduxProvider>

      <GoogleAnalytics gaId="AW-16464823771" />
    </html>
  );
}
