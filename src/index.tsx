import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { WindowExtendedWithFacebook } from './@types';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

declare let window: WindowExtendedWithFacebook;
declare let globalThis: WindowExtendedWithFacebook;
let handler: NodeJS.Timeout;

const waitForFullDownload = () => new Promise<null>(resolve => {
  handler = setInterval(() => {
    if (window.FB) {
      clearInterval(handler)
      resolve(null)
    }
    console.log('Waiting for FB download')
  }, 100)
})

const initFacebookSDK = async function (): Promise<null> {
  return new Promise<null>(async function (resolve) {
    window.fbAsyncInit = async function () {
      return new Promise<null>(async resolve => {
        // await waitForFullDownload();
        // console.log(globalThis, window.FB)
        window.FB?.init({
          appId: process.env.REACT_APP_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v15.0',
        });

        window.FB?.AppEvents?.logPageView();
        resolve(null);
      })

    };

    (async function (d: Document, s: string, id: string) {
      let js: HTMLScriptElement;
      let fjs: HTMLScriptElement = d.getElementsByTagName(s)[0] as HTMLScriptElement;
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
      console.log("[facebook] Loaded the JS")
      window.fbAsyncInit?.call(null);
      resolve(null);
    }(document, 'script', 'facebook-jssdk'));
  })
}

export const facebook = {
  initialized: false,
  initFacebookSDK,
  checkLoginStatus: function (): Promise<object> {
    return new Promise<object>((resolve) => {
      console.log("[facebook] inside checkLoginStatus", Object.keys(globalThis));

      window.FB?.getLoginStatus(function (response: object) {
        console.log("[facebook] inside getLoginStatus")
        console.log(response)
        resolve(response)
      })

    });
  }
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
