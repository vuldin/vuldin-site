import { GlobalContextProvider } from "../context/global";
import App from "next/app";
import "../styles/index.css";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <GlobalContextProvider>
        <Component {...pageProps} />
      </GlobalContextProvider>
    );
  }
}
export default MyApp;
