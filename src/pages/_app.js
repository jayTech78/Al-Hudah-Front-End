// pages/_app.js
import "bootstrap/dist/css/bootstrap.min.css"; 
import { useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme"; // note: ../theme

function MyApp({ Component, pageProps }) {
  // Load Bootstrap JS only on the client side
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
