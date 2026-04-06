# ゴルフ80切り計画

## 目的
最短で80切りを達成する。  
スイング改善より `スコア改善（再現性・ミス削減・リスク管理）` を最優先にする。  
特にドライバーの `左OB（フック）` を最優先で減らす。

## 最重要ルール
- 優先順: `OB削減 > 3パット削減 > アイアントップ削減`
- ティーショット: `右OK・左NG`
- 球筋: `フェード前提`（ドロー封印）
- 狙い: `常にボギーオン`
- 練習評価: `飛距離より左ミスゼロを優先`
- Trackman の見方: `右寄りのデータでも、左が消えているなら許容`

## 成功基準
- OB: `3〜4 -> 1以下`
- 3パット: `3〜5 -> 1以下`
- ボギーオン率: `42% -> 55%以上`
- ドライバー左ミス: `0を最優先`

## クイックスタート
1. ラウンド前に `checklists/round-checklist.md` を確認する
2. 練習ごとに `templates/practice-log.md` をコピーして記録する
3. ラウンドごとに `templates/round-log.md` をコピーして記録する
4. 週1で `templates/weekly-review.md` をコピーして改善点を1つだけ決める

## Trackman 連携

### 手動で入れる
- `portal.trackmangolf.com` の `Activities` で `Course / Game / Combine / Report / Screencast` を確認する
- `Practice Sessions` は `Trackman Golf App` 側で確認する
- `Shot Analysis` を表データで残したいときは `TPS` から `CSV` を出す
- 方針は `docs/trackman-import.md` を参照

### 半自動で入れる
- `npm install`
- `npm run trackman:import`
- Chrome で Trackman にログインして、保存したい画面を開く
- Enter を押すと `data/trackman/captures/` にキャプチャと下書きが保存される
- 手順詳細は `docs/trackman-browser-import.md` を参照

## 現在のクラブセット
- 詳細は `docs/club-set.md` を参照
- セッティングの論点: `7W` と `4U` の併用はせず、どちらを入れるか検討中
- ドライバー方針: `短尺44インチ` で再現性優先

## 運用ルール
- キーワード: `低く出す / ボールの先を打つ / フェースを返さない / 前傾キープ / 左主導`
- 難しい技術論は禁止
- 指示はシンプル・即実行のみ
- 1ラウンドで改善できる行動だけ採用する
- ティーショットは `左が見えた時点で修正` する
- 練習ログと週次レビューでは `左OBにつながる傾向` を最優先で扱う
