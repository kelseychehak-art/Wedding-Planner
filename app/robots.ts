import type { MetadataRoute } from "next";

/*
 * Guest pages are meant to be found; the back-office is not. Belt and braces
 * alongside the noindex metadata on /admin.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/admin/", "/api/"] }],
  };
}
