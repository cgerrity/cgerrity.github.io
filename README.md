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
projects/index.html    Research + side-project listing
_projects/*.md         One page per project
writing/index.html     Explainer listing (currently unpublished, see below)
_writing/*.md          Long-form explainers (currently unpublished, see below)
```

## Hidden for review

The explainers in `_writing/` and the `/writing/` listing are drafts I have not reviewed
yet, so they are kept in the repository but excluded from the published site. Each one
carries `published: false` in its front matter, which keeps Jekyll from building it, and
the **Writing** nav link only appears when the collection has something published in it.

To put them back, delete the `published: false` line from `writing/index.html` and from
whichever files in `_writing/` are ready. The nav link returns on its own. Pages that used
to link to an explainer (home, publications, about, the project pages) had those links
removed, so re-add them by hand.

## Editing

- Add a project: create `_projects/<slug>.md` with `category: research|side`,
  `order:`, and the front-matter fields the `project` layout reads.
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
