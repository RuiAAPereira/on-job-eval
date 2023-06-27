import PageHead from "@/components/layout/head";
import { type NextPage } from "next";
import Average from "@/components/charts/Average";

const Home: NextPage = () => {
  const title = "Avaliação On Job Training";

  return (
    <>
      <PageHead title={title} />
      <main>
        <Average />
      </main>
    </>
  );
};

export default Home;
