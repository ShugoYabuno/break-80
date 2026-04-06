# Trackman 取り込みメモ

## 結論
このリポジトリに Trackman の情報を入れるなら、まずは `API 連携` ではなく `Golf App / Portal / TPS から必要な数字だけ転記する` 運用が一番現実的です。
このプロジェクトでは、Trackman の数値も `左OBを減らせるか` という基準で読む。

理由:
- 2026-04-06 時点で公開のヘルプ上は、`Practice Sessions` は `Portal` に直接は出ず、主に `Trackman Golf App` で確認する案内になっている
- `Portal` で見やすいのは `Course / Game / Combine / Report / Screencast`
- `Shot Analysis` は `TPS` から `CSV` エクスポートできる

## どこから何を取るか

### 1. 普段の練習ログに入れる数字
使う場所: `Trackman Golf App`

取る候補:
- クラブ平均キャリー
- 左右ブレ
- ミス傾向
- 7I や Driver の代表値
- セッションの気づき
- 左に出た球の本数
- 左に曲がった球の本数

使い方:
- 練習後に `Activities` を開く
- その日の `Practice Range` または `Shot Analysis` を開く
- `templates/practice-log.md` の `Trackman 取り込み` 欄に転記する
- 数字の評価は `右に逃げたか` より `左OBの種があるか` を優先する

### 2. ラウンド結果に入れる数字
使う場所: `Portal` または `Trackman Golf App`

取る候補:
- スコアカード
- ホールごとのショット距離
- パット数
- 使用クラブ

使い方:
- `Activities` から `Course Session` を開く
- 必要な数字だけ `templates/round-log.md` に転記する

### 3. 球ごとの詳細データを残したいとき
使う場所: `TPS`

取る候補:
- 1球ごとの CSV
- テーブル形式のショットデータ

使い方:
- `All Activities > Shot History`
- セッションを選ぶ
- `Table View`
- `Export`
- `Trackman CSV` を保存

## このリポジトリでのおすすめ運用

### A. まずは手動転記
一番おすすめです。

理由:
- 今のリポジトリは Markdown ベースで軽い
- 練習の目的は「全部のデータ保存」より「次回の行動を1つ決めること」
- 毎回 3〜6 個の数字だけ持ってくる方が続く

毎回入れる数字の例:
- Driver carry
- Driver 左ミス本数
- Driver 右ミス本数
- 7I carry
- 7I クリーンヒット本数
- 今日の最大ミス傾向
- 左に出た球が何球あったか

### B. もう一歩進めるなら CSV 置き場を作る
CSV を保存したいなら、例えば `data/trackman/` を作って日付ごとに保存します。

ファイル名の例:
- `data/trackman/2026-04-06-driver-shot-analysis.csv`
- `data/trackman/2026-04-06-7i-shot-analysis.csv`

この運用にすると:
- 後から平均値を見返しやすい
- 将来スクリプト化しやすい
- Markdown のログと生データを分けて管理できる

### C. 完全自動化は最後
ブラウザの開発者ツールで内部通信を読んで自動取得する方法は考えられますが、おすすめはしません。

理由:
- 公式の公開プレイヤー API を確認できなかった
- 内部 API は変更に弱い
- ログインや認証の扱いが面倒
- 利用規約や将来のメンテ負荷の確認が必要

## 迷ったらこの流れ
1. `Practice` は `Golf App` で見る
2. `Round` は `Portal` で見る
3. 球単位の詳細は `TPS` から `CSV` を出す
4. このリポジトリには `左OB削減に効く数字だけ` 転記する

## 参考
- [Portal | Which Activities Can You Sync into Your Trackman Cloud?](https://support.trackmangolf.com/hc/en-us/articles/38142841966747-Portal-Which-Activities-Can-You-Sync-into-Your-Trackman-Cloud)
- [Portal (Player) | My Activities Within The Golf Portal](https://support.trackmangolf.com/hc/en-us/articles/28111485485083-Portal-Player-My-Activities-Within-The-Golf-Portal)
- [Golf App | Overview of Activities](https://support.trackmangolf.com/hc/en-us/articles/28109583152411-Golf-App-Overview-of-Activities)
- [Golf App | What Is The Trackman Golf App](https://support.trackmangolf.com/hc/en-us/articles/5089752898203-Golf-App-What-Is-The-Trackman-Golf-App)
- [Shot Analysis | How To Export A CSV File From TPS](https://support.trackmangolf.com/hc/en-us/articles/12985883274139-Shot-Analysis-How-To-Export-A-CSV-File-From-TPS)
