import React from "react";
import { useSession } from "next-auth/react";

export default function PageHeader(pageTitle: string) {
  const { data: sessionData } = useSession();
  pageTitle = pageTitle;

  return (
    <div className="bg-gray-600 px-8 py-4">
      <h1 className="text-3xl font-bold text-white">{pageTitle}</h1>
      <p>
        {sessionData && (
          <span>
            {sessionData.user?.name} - logado como{" "}
            {sessionData.user?.role.toLowerCase()}
          </span>
        )}
      </p>
    </div>
  );
}
