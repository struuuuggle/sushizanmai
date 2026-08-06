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

`dat/score.csv` を fetch で読み込むため、`index.html` を `file://` で直接開いても動きません。
ローカル HTTP サーバ経由で開いてください。

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

CSV をローカルで編集すると、リロードするだけで表示に反映されます。
