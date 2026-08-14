// theme.js
import { extendTheme } from "@chakra-ui/react";

// Customize your theme here
const theme = extendTheme({
  colors: {
    primary: {
      100: "#E3F8FF",
      200: "#B3ECFF",
      300: "#81DEFD",
      400: "#5ED0FA",
      500: "#40C3F7",
      600: "#2BB0ED",
      700: "#1992D4",
      800: "#127FBF",
      900: "#0B69A3",
    },
  },
  fonts: {
    heading: "Georgia, serif",
    body: "Arial, sans-serif",
  },
});

export default theme;
