import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/", current: "" },
  { name: "Categorias", href: "/categories", current: "" },
  { name: "Perguntas", href: "/questions", current: "" },
  { name: "Avaliação", href: "/evaluation", current: "" },
  { name: "Formandos", href: "/employees", current: "" },
  { name: "Reports", href: "#", current: "" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const NavigationMd = () => {
  const pathname = usePathname();
  return (
    <div>
      <div>

      </div>
      <div className="hidden md:block">
        <div>
          {navigation.map((item) => {
            const current = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  current
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "rounded-md px-3 py-2 text-sm font-medium"
                )}
                aria-current={current ? "page" : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
