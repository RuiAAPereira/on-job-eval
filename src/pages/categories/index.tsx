import Head from "next/head";
import { useSession } from "next-auth/react";
import CategoriesTable from "@/components/categories/TableCategories";
import AddCategory from "@/components/categories/AddCategory";
import Wrapper from "@/components/common/Wrapper";

export default function Categories() {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Categorias</title>
        <meta name="description" content="On job evaluation" />
        <link rel="shortcut icon" href="public/favicon.ico" />
      </Head>
      <Wrapper>
        <div>
          <h1>Categorias</h1>
          <p>
            {sessionData && (
              <span>
                {sessionData.user?.name} - logado como{" "}
                {sessionData.user?.role.toLowerCase()}
              </span>
            )}
          </p>
        </div>

        <div>
          <div>
            {/* <AddCategory /> */}
          </div>
          <div>
            {/* <CategoriesTable /> */}
          </div>
        </div>
      </Wrapper>
    </>
  );
}
