import Link from "next/link";
import Image from "next/image";

export default function Error404() {
  return (
    <div className="flex flex-col-reverse items-center justify-center gap-16 px-4 py-24 md:gap-28 md:px-44 md:py-20 lg:flex-row lg:px-24 lg:py-24">
      <div className="relative w-full pb-12 lg:pb-0 xl:w-1/2 xl:pt-24">
        <div className="relative">
          <div className="absolute">
            <div className="">
              <h1 className="my-2 text-2xl font-bold text-gray-800">
                Ocorreu um erro!
              </h1>
              <p className="my-2 text-gray-800">
                Pedimos desculpa! Por favor, volte para a nossa homepage para
                navegar para onde precisa ir.
              </p>
              <Link
                href="/"
                className="md my-2 rounded border bg-indigo-600 px-8 py-4 text-center text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50 sm:w-full lg:w-auto"
              >
                Ir para Home!
              </Link>
            </div>
          </div>
          <div>
            <Image src="/404-2.png" height={190} width={516} alt="404" />
          </div>
        </div>
      </div>
      <div>
        <Image src="/Group.png" height={400} width={539} alt="Group" />
      </div>
    </div>
  );
}
