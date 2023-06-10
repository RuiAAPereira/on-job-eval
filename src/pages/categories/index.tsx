import Head from "next/head";
import { useSession } from "next-auth/react";
import CategoriesList from "@/components/categories/CategoriesList";
import CreateCategory from "@/components/categories/CreateCategory";

export default function Categories() {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Categories</title>
        <meta name="description" content="Full stack todo app" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col px-4 py-16 ">
          {sessionData && (
            <div className="grid grid-cols-1 gap-4 md:gap-8">
              <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white">
                <h3 className="text-xl font-bold">Categorias</h3>
                <CategoriesList />
                <CreateCategory />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
