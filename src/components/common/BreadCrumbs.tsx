import { useRouter } from "next/router";
import Link from "next/link";
import { FaChevronRight, FaHouse } from "react-icons/fa6";

export default function BreadCrumbs() {
  const router = useRouter();
  const { pathname } = router;
  const breadcrumbSegments = pathname
    .split("/")
    .filter((segment) => segment !== "");
  const filteredSegments = breadcrumbSegments.filter(
    (segment) => segment !== "[id]"
  );

  return (
    <nav
      className="flex border-b border-slate-300 px-12 py-4 shadow-md"
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center capitalize text-gray-700 hover:text-gray-900"
          >
            <FaHouse className="mr-2" />
            Home
          </Link>
        </li>
        {filteredSegments.map((segment, index) => {
          const segmentPath = `/${filteredSegments
            .slice(0, index + 1)
            .join("/")}`;
          const isLastSegment = index === filteredSegments.length - 1;

          return (
            <li key={segmentPath}>
              <div className="flex items-center">
                <FaChevronRight />
                {isLastSegment ? (
                  <span className="ml-1 text-sm font-medium capitalize text-gray-700 hover:text-gray-900 md:ml-2">
                    {segment}
                  </span>
                ) : (
                  <Link
                    href={segmentPath}
                    className="ml-1 text-sm font-medium capitalize text-gray-700 hover:text-gray-900 md:ml-2"
                  >
                    {segment}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
