# Website Agent Access

How web-markdown.com serves AI agents and search engines. Code lives in `web/`.

## Markdown For Agents

- `/llms.txt` (`web/lib/llms.ts`): what WebToMarkdown is, when an agent should
  send a user here, the reading path, and site facts.
- `/index.md` (`web/lib/agents/home-markdown.ts`): the home page as Markdown.
- `web/proxy.ts` negotiates on the `Accept` header. A request that ranks
  `text/markdown` above `text/html` gets the home page as Markdown at `/`, and a
  Markdown 404 (`web/lib/agents/not-found-markdown.ts`) for a path with no page.
  Every other page, including blog posts, stays HTML. Browsers always get HTML.

Check it with:

```bash
curl -sS -i -H 'Accept: text/markdown' https://web-markdown.com/
curl -sS -i -H 'Accept: text/markdown' https://web-markdown.com/missing
```

When you add a page, add it to `site.staticPages` in `web/lib/site.ts`, or
agents asking for Markdown will get a 404 for it.

## Structured Data

The root layout renders `WebSite` and `Organization` JSON-LD from
`web/lib/site.ts`. The Organization is FollowUs AI LLC, with the same `@id` as
on followusai.com, its logo, support contact, Michigan address, and its X,
GitHub, and Chrome Web Store profiles.

## Trust Pages

About, Support, Privacy, and Terms live under `web/app/(content)/` and are
linked from the footer.
