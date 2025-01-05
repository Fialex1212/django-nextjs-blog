import Header from "@/coponents/Header/Header";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Header />
      <main>{children}</main>
    </>
  );
}
