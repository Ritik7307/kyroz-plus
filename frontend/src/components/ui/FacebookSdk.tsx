"use client";

import Script from "next/script";

export default function FacebookSdk() {
  return (
    <Script
      id="fb-sdk"
      src="https://connect.facebook.net/en_US/sdk.js"
      strategy="lazyOnload"
      onLoad={() => {
        (window as any).fbAsyncInit = function () {
          (window as any).FB.init({
            appId: '1468136621307037', // From .env
            cookie: true,
            xfbml: true,
            version: 'v19.0',
          });
        };
      }}
    />
  );
}
