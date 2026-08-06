# [sushizanmai](https://struuuuggle.github.io/sushizanmai/)

- You can see my typing skill improving.

See also [寿司打 (Sushida)](http://typing.sakura.ne.jp/sushida/index.html), one of the most famous typing games in Japan.

## Setup

```sh
git clone https://github.com/struuuuggle/sushizanmai.git
npm install
```

## Local development

The page fetches `data/score.csv`, so opening `index.html` directly via `file://` does not work.
Serve the site over HTTP instead:

```sh
npm run serve
# → http://localhost:8000
```

Local edits to the CSV are reflected by simply reloading the page.

## CSS (Tailwind)

Styles are managed with Tailwind CSS v4. The source is `css/input.css`, and the build output is `css/style.css`.
The build output is committed as well, so that GitHub Pages can serve it as-is.

```sh
npm run build:css   # generate css/style.css from css/input.css
npm run watch:css   # rebuild automatically while developing
```

Whenever you change classes in `index.html` or edit `css/input.css`, run `npm run build:css` and commit the regenerated `css/style.css` together with your change.
