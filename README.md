# cgerrity.github.io

Personal website for Charles Grimes Gerrity, Ph.D. — computational neuroscientist
and machine learning engineer. Built with Jekyll and served by GitHub Pages.

## Structure

```
_config.yml            Site config, nav links, collections
_layouts/              default, page, project, article
_includes/             head, header, footer
assets/css/main.css    Design system (tokens, light/dark, components)
assets/js/site.js      Theme toggle + scroll reveal (progressive enhancement)
assets/img/            Headshot, favicon
index.html             Home
about.md               About / the transition narrative
publications.html      Publications, theses, talks, press
projects/index.html    Research + side-project listing (reads _data/research.yml)
_data/research.yml     The short entries shown on that listing
_projects/*.md         One long page per project (currently unpublished, see below)
writing/index.html     Explainer listing (currently unpublished, see below)
_writing/*.md          Long-form explainers (currently unpublished, see below)
```

## Hidden for review

Two sets of long-form pages are drafts I have not reviewed yet. They are kept in the
repository but excluded from the published site by a `published: false` line in their
front matter:

- the explainers in `_writing/`, plus the `/writing/` listing. The **Writing** nav link
  only appears when that collection has something published in it, so it is hidden too.
- the long project pages in `_projects/`. The `/projects/` listing still names each piece
  of work in a sentence, from `_data/research.yml`, and links out to the paper, the code,
  or the thesis instead.

To put a page back, delete its `published: false` line (and, for an explainer, the one in
`writing/index.html`). Links that used to point at these pages were removed from the home,
publications, about, and listing pages, so re-add them by hand.

## Editing

- Add a project: add an entry to `_data/research.yml` for the listing. A long page for
  it goes in `_projects/<slug>.md` with `category: research|side`, `order:`, and the
  front-matter fields the `project` layout reads.
- Add an explainer: create `_writing/<slug>.md`; it uses the `article` layout,
  auto-computes reading time, and renders a table of contents from the `toc:` list.
  Leave `published: false` out of the front matter when it is ready to go live.
- Links (GitHub, Scholar, preprint, CV, email) live in `_config.yml` under `links:`.

## Build locally

```bash
# Requires Ruby 3+ and Jekyll (gem install jekyll).
jekyll serve        # http://127.0.0.1:4000
jekyll build        # outputs to _site/ (gitignored)
```

GitHub Pages builds the site automatically on push to `main`.
