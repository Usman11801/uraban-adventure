import "@css/aos.css";
import "@css/bootstrap.min.css";
import "@css/flaticon.min.css";
import "@css/fontawesome-5.14.0.min.css";
import "@css/magnific-popup.min.css";
import "@css/nice-select.min.css";
import "@css/slick.min.css";
import "@css/style.css";
import "./globals.css";
import 'rc-slider/assets/index.css';
import CartProviderWrapper from "@/components/CartProviderWrapper";

export const metadata = {
  title: "Urban Advanture Tourism ",
  description:
    "Urban Advanture Tourism",
  icons: {
    icon: [
      { url: '/logo.png', sizes: 'any' },
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProviderWrapper>{children}</CartProviderWrapper>
      </body>
    </html>
  );
}
