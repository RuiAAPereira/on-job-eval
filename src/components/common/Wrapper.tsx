import React from "react";
import BreadCrumbs from "@/components/common/BreadCrumbs";

type WrapperProps = {
  children: React.ReactNode;
};

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <>
      <BreadCrumbs />
      <main className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </>
  );
};

export default Wrapper;
