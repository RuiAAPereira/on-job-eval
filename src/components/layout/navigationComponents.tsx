import { AcademicCapIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
	{ name: "Home", href: "/", current: "" },
	{ name: "Categories", href: "/categories", current: "" },
	{ name: "Team", href: "#", current: "" },
	{ name: "Projects", href: "#", current: "" },
	{ name: "Calendar", href: "#", current: "" },
	{ name: "Reports", href: "#", current: "" },
];

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

export const NavigationMd = () => {
	const pathname = usePathname();
	return (
		<div className="flex items-center">
			<div className="flex-shrink-0">
				<AcademicCapIcon className="block h-8 w-8 text-blue-500" aria-hidden="true" />
			</div>
			<div className="hidden md:block">
				<div className="ml-10 flex items-baseline space-x-4">
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
								aria-current={current ? "page" : undefined}>
								{item.name}
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
};
