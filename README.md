# [sushizanmai](https://struuuuggle.github.io/sushizanmai/)

- You can see my typing skill improving.

See also [寿司打 (Sushida)](https://sushida.net/), one of the most famous typing games in Japan.

## Setup

```sh
git clone https://github.com/struuuuggle/sushizanmai.git
npm install
```

## Local development

Build the assets first, then serve the site over HTTP.
The page fetches `data/score.csv`, so opening `index.html` directly via `file://` does not work.

```sh
npm run build   # generate css/style.css and js/vendor/d3.min.js
npm run dev
# → http://localhost:8080 (the actual URL is printed on startup)
```

Local edits to the CSV are reflected by simply reloading the page.

## Build

Build artifacts are not committed; they are generated both locally and in CI.

- CSS is managed with Tailwind CSS v4. The source is `css/input.css`, and the build output is `css/style.css`.
- d3 (v7) is managed with npm and vendored to `js/vendor/d3.min.js` at build time.

```sh
npm run build       # build:css + build:js
npm run build:css   # generate css/style.css from css/input.css
npm run build:js    # copy node_modules/d3/dist/d3.min.js to js/vendor/
npm run watch:css   # rebuild CSS automatically while developing
```

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds the assets, assembles the site into `dist/`, and deploys it to GitHub Pages.
