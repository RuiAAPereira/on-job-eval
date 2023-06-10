import { api } from "@/utils/api";
import Category from "./Category";

export default function CategoriesList() {
  const { data: categories, isLoading, isError } = api.category.getAll.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error</p>;
  }

  return (
    <>
      {categories.length
        ? categories?.map((c) => {
            return <Category key={c.id} category={c} />;
          })
        : "Criar uma categoria para iníciar"}
    </>
  );
}
