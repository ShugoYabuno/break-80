# Trackman ブラウザ内 JS 抽出

## 結論
できます。`Trackman のページを開いた状態で DevTools Console に JavaScript を貼り付けて、その場で JSON をダウンロードする` 方式です。

この方法が向いている場面:
- ブラウザに今見えている情報をすぐ抜きたい
- Playwright を毎回動かすほどではない
- DOM から `table` やカードっぽい要素を直接拾いたい

## 使い方
1. Chrome で Trackman にログインする
2. `Activities` 一覧か詳細ページを開く
3. DevTools を開く
4. `Console` に `[trackman-browser-extract.js](/Users/shugoyabuno/Documents/MyProject/break-80/scripts/trackman-browser-extract.js)` の中身を貼る
5. Enter を押す
6. `trackman-extract-...json` がダウンロードされる

## すぐ表示したいとき
ターミナルで次を実行すると、貼り付け用コードをそのまま表示できます。

```bash
npm run trackman:browser-script
```

## 取れるもの
- ページ全体の可視テキスト
- DOM 上の `table`
- `Carry / Side / Spin / Ball Speed` っぽい文言を含むブロック
- リンク一覧
- クラブ名を含む行
- 数字入り行の簡易パース結果

## 注意
- 公式 API を使うわけではない
- Trackman の DOM 変更には影響を受ける
- 仮想スクロールの UI では、画面に出ていない行は取れないことがある
- 正式ログにする前に `左ミス本数` や `Carry` は目視確認する

## おすすめの使い分け
- 一覧や詳細をまとめて保存したい: `trackman:import`
- 今見えているページをその場で JSON 化したい: `trackman-browser-extract.js`
