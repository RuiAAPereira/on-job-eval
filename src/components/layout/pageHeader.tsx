import React from "react";
import { useSession } from "next-auth/react";

export default function PageHeader(pageTitle: string) {
  const { data: sessionData } = useSession();
  pageTitle = pageTitle;

  return (
    <div>
      <h1>{pageTitle}</h1>
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
