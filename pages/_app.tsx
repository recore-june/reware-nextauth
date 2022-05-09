import { SessionProvider } from "next-auth/react";
import { NextComponentType } from "next";
import { AppContext, AppInitialProps, AppProps } from "next/app";

const WrapperApp: NextComponentType<AppContext, AppInitialProps, AppProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

WrapperApp.getInitialProps = async ({
  Component,
  ctx,
}: AppContext): Promise<AppInitialProps> => {
  let pageProps: any = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return { pageProps };
};

export default WrapperApp;
