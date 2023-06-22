import PageHead from "@/components/layout/head";
import { type NextPage } from "next";


const Home: NextPage = () => {
  const title = "Avaliação On Job Training";

  return (
    <>
      <PageHead title={title} />
      <main>
        {/* <h1 className="text-3xl font-bold">Hello world!</h1> */}
      </main>
    </>
  );
};

export default Home;
