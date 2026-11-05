# Shilian Chen — Homepage and Blog

The public site is hosted by the existing **Chansl-Lucky** GitHub account at <https://chansl-lucky.github.io/>. The blog lives at `/blog/`; no new platform account is needed. The first five research notes expand on public News updates; article dates record their actual publication date, separately from the events discussed.

## Publish an article

1. Add a **publication-ready** HTML fragment, for example `content/articles/my-post.html`. Use headings starting at `<h2>`; the template supplies the page title. Body HTML is trusted and is not sanitized. Use root-relative links such as `/assets/blog/my-figure.png` for images and `/blog/another-post/` for other articles.
2. Put public images in `assets/blog/`. Add an entry to `content/posts.json`:

```json
{
  "slug": "my-post",
  "title": "Article title",
  "date": "2026-11-05",
  "summary": "A short description used on the blog, in search previews, and in RSS.",
  "body": "content/articles/my-post.html",
  "image": "/assets/blog/my-figure.png",
  "tags": ["Continual learning"],
  "published": true
}
```

`image` and `tags` are optional. Dates must be real `YYYY-MM-DD` dates; slugs use lowercase letters, digits, and single hyphens. Body and image files must exist inside this repository. Entries without `published: true`, including `published: false`, are omitted from generated pages, RSS, and the sitemap. Publishing is explicit; the date does not schedule a future release.

3. Run from the repository root:

```sh
python3 scripts/build_blog.py
```

4. Review the generated `/blog/` and article pages, commit the source and generated files, then push the existing GitHub Pages repository. The site uses plain HTML; the builder needs only Python 3.10+ and has no external dependencies.

**Keep private drafts outside this public repository.** A `published: false` flag only hides an entry from generated lists; it does not make any committed file private. `drafts/` is ignored as an extra guard, but do not commit private material anywhere in this repository or its history.

## Maintenance

- Edit the shared header/footer in `index.html` between the `SITE_HEADER_START` / `SITE_HEADER_END` and `SITE_FOOTER_START` / `SITE_FOOTER_END` comments, then rebuild. Blog pages use root-relative links and highlight the Blog navigation item.
- Edit `templates/post.html` for the article layout and `style.css` / `script.js` for the shared design and interactions. Do not hand-edit generated `blog/index.html`, article pages, `blog/feed.xml`, or `sitemap.xml`.
- The builder adds a table of contents when an article has at least two `<h2>` headings, estimates reading time, and updates RSS and sitemap entries. Removing a published entry removes its generated article page on the next build.
- Posts are ordered by publication date; entries sharing a date keep their order in `content/posts.json`. Optional images appear on the index and article page. SVG illustrations use the profile photo as a raster fallback in social cards.
- `/blog/feed.xml` is a public RSS feed for feed readers. There is no email subscription service.
- To inspect output without changing the published files, use `python3 scripts/build_blog.py --output-dir /tmp/shilian-blog-preview`. That directory contains generated HTML/XML only; shared styles, scripts, and images remain in the repository.
