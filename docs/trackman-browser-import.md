# Trackman 半自動取り込み

## 結論
このスクリプトは `Trackman に手でログイン` したあと、表示中のページを保存して、練習ログの下書きを自動生成します。

向いている場面:
- Activities 一覧を残したい
- その日の詳細ページを保存したい
- 後で数値を見返せるようにしたい
- 完全自動化まではまだやりたくない

## できること
- Chrome を開く
- `portal.trackmangolf.com/player/activities` を開く
- ログイン後の表示内容を `png / html / txt / json` で保存する
- 練習ログ用の下書き `practice-log-draft.md` を作る
- 必要なら別方式として、ブラウザ内 JavaScript でその場の DOM を JSON 抽出できる

## できないこと
- ログインを完全自動化すること
- Trackman の画面構造が変わっても必ず正しく数値化すること
- PDF のような詳細表を完全に解析すること

## 使い方
1. `npm install`
2. `npm run trackman:import`
3. Chrome で Trackman にログインする
4. 取り込みたい `Activities` または詳細ページを開く
5. ターミナルに戻って Enter を押す
6. `data/trackman/captures/<timestamp>/practice-log-draft.md` を確認する

## 保存されるもの
- `page.png`: 画面キャプチャ
- `page.html`: HTML
- `page.txt`: 可視テキスト
- `metadata.json`: URL とタイトル
- `metrics.json`: 抽出できた候補値
- `practice-log-draft.md`: 練習ログの下書き

## 注意
- このプロジェクトでは `左OB削減` が最優先なので、下書きも `右OK・左NG` の基準で読む
- 画面に見えていない数値は拾えない
- 正式ログにする前に、左ミス本数やクラブ別 Carry を必ず目視確認する
- ブラウザ内 JS 版を使いたいときは `docs/trackman-browser-js.md` を参照
