"use client";
import React, { Fragment } from "react";
import { NavigationMd } from "./navigationComponents";
import { getSession } from "next-auth/react";

let user = {
  name: "username",
  email: "email@example.com",
};

const navigation = [
  { name: "Home", href: "/", current: "" },
  { name: "Categorias", href: "/categories", current: "" },
  { name: "Perguntas", href: "/questions", current: "" },
  { name: "Projects", href: "#", current: "" },
  { name: "Calendar", href: "#", current: "" },
  { name: "Reports", href: "#", current: "" },
];

let userNavigation = [
  // { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  // { name: "Logout", href: "#" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

async function getUser() {
  const session = await getSession();

  if (session) {
    user.name = session.user?.name ?? "";
    user.email = session.user?.email ?? "";
  }
}

export default function Navbar() {
  getUser();

  return <></>;
}
