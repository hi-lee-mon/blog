import Breadcrumbs from "@/components/client/breadcrumbs/breadcrumbs";
import Footer from "@/components/layout/footer/footer";
import Header from "@/components/layout/header/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Breadcrumbs />
      <main>{children}</main>
      <Footer />
    </>
  );
}
