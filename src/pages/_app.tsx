import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/navbar";
import { ThemeProvider } from "next-themes";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class">
        <Navbar />
        <Component {...pageProps} />
        <Toaster
          toastOptions={{
            success: {
              style: {
                background: "#0ABF30",
                border: "1px solid #34495E",
                padding: "16px",
                color: "#e0ddd5",
              },
            },
            error: {
              style: {
                background: "#E24D4C",
                border: "1px solid #34495E",
                padding: "16px",
                color: "#e0ddd5",
              },
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
