export { default } from "next-auth/middleware";

export const config = {
	matcher: ["/:path*", "/app/:path*"],
};
