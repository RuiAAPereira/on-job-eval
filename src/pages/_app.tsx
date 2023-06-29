import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import Navbar from "@/components/layout/navbar";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <div className="pt-28">
        <Component {...pageProps} />
      </div>
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
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
