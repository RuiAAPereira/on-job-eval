import Head from "next/head";
import { useSession } from "next-auth/react";
import CategoriesTable from "@/components/categories/CategoriesTable";
import AddCategory from "@/components/categories/AddCategory";

export default function Categories() {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Categories</title>
        <meta name="description" content="Full stack todo app" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="h-full">
        <div className="bg-gray-600 px-8 py-4">
          <h1 className="text-3xl font-bold text-white">Categorias</h1>
          <p>
            {sessionData && (
              <span>
                {sessionData.user?.name} - logado como{" "}
                {sessionData.user?.role.toLowerCase()}
              </span>
            )}
          </p>
        </div>
        {sessionData && (
          <div className="flex h-full flex-wrap gap-12 p-12">
            <div className="max-w-md flex-auto">
              <AddCategory />
            </div>
            <div className="grow">
              <CategoriesTable />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
