import { site } from "@/lib/site";

/** The Markdown 404 body: what went wrong and where to go instead. */
export function createNotFoundMarkdown(pathname: string) {
  return `# Page not found

There is no page at \`${pathname}\` on the ${site.name} website.

- [Home](${site.url}/): what ${site.name} does and how to install it
- [llms.txt](${site.url}/llms.txt): every page on this site, for agents
- [Sitemap](${site.url}/sitemap.xml)
`;
}
