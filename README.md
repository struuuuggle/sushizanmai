# [sushizanmai](https://struuuuggle.github.io/sushizanmai/)

- You can see my typing skill improving.

See also [寿司打](http://typing.sakura.ne.jp/sushida/index.html), one of the most famous typing games in Japan.

## Setup

```sh
git clone --recursive https://github.com/struuuuggle/sushizanmai.git
# クローン済みの場合は submodule だけ取得
git submodule update --init
```

## Local development

`data/score.csv` を fetch で読み込むため、`index.html` を `file://` で直接開いても動きません。
ローカル HTTP サーバ経由で開いてください。

```sh
python3 -m http.server 8000   # または npm run serve
# → http://localhost:8000
```

CSV をローカルで編集すると、リロードするだけで表示に反映されます。

## CSS (Tailwind)

スタイルは Tailwind CSS v4 で管理しています。ソースは `css/input.css`、ビルド成果物が `css/style.css` です。
GitHub Pages でそのまま配信するため、`css/style.css` もコミットします。

```sh
npm install
npm run build:css   # css/input.css → css/style.css を生成
npm run watch:css   # 開発中はファイル監視で自動再生成
```

`index.html` のクラスや `css/input.css` を変更したら、`npm run build:css` を実行して `css/style.css` を再生成し、あわせてコミットしてください。
