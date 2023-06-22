import Image from "next/image";
import logo from "../../../public/logo.png";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useState } from "react";

const navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="fixed h-24 w-full shadow-xl">
      <div className="flex h-full w-full items-center justify-between px-4 2xl:px-16">
        <Link href="/">
          <Image
            src={logo}
            alt="logo"
            width={205}
            height={75}
            className="cursor-pointer"
            priority
          />
        </Link>
        <div className="hidden sm:flex">
          <ul className="hidden sm:flex">
            <Link href={"/employees"}>
              <li className="ml-10 text-lg uppercase hover:border-b">
                Formandos
              </li>
            </Link>
            <Link href={"/employees"}>
              <li className="ml-10 text-lg uppercase hover:border-b">
                Formandos
              </li>
            </Link>
            <Link href={"/employees"}>
              <li className="ml-10 text-lg uppercase hover:border-b">
                Formandos
              </li>
            </Link>
          </ul>
        </div>
        <div onClick={handleNav} className="cursor-pointer pl-24 md:hidden">
          <AiOutlineMenu size={25} />
        </div>
      </div>
      <div
        className={
          menuOpen
            ? "fixed left-0 top-0 h-screen w-[75%] bg-slate-200 p-10 duration-500 ease-in sm:hidden"
            : "fixed left-[-100%] top-0 p-10 duration-500 ease-in"
        }
      >
        <div className="flex w-full items-center justify-end sm:hidden">
          <div onClick={handleNav} className="cursor-pointer">
            <AiOutlineClose size={25} />
          </div>
        </div>
        <div className="flex-col py-4 sm:hidden">
          <ul>
            <Link href={"/employees"}>
              <li
                className="cursor-pointer py-2"
                onClick={() => setMenuOpen(false)}
              >
                Formandos
              </li>
            </Link>
            <Link href={"/employees"}>
              <li
                className="cursor-pointer py-2"
                onClick={() => setMenuOpen(false)}
              >
                Formandos
              </li>
            </Link>
            <Link href={"/employees"}>
              <li
                className="cursor-pointer py-2"
                onClick={() => setMenuOpen(false)}
              >
                Formandos
              </li>
            </Link>
          </ul>
        </div>
        <Link href="/">
          <Image
            src={logo}
            alt="logo"
            width={205}
            height={75}
            className="cursor-pointer pt-10"
            priority
          />
        </Link>
      </div>
    </nav>
  );
};

export default navbar;
