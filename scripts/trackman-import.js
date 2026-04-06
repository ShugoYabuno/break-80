#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const CAPTURE_ROOT = path.join(ROOT, "data", "trackman", "captures");
const PROFILE_ROOT = path.join(ROOT, "data", "trackman", "browser-profile");
const DEFAULT_URL = "https://portal.trackmangolf.com/player/activities";

function parseArgs(argv) {
  const flags = {
    headless: false,
    url: DEFAULT_URL,
    outDir: CAPTURE_ROOT,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--headless") {
      flags.headless = true;
    } else if (arg === "--url" && argv[i + 1]) {
      flags.url = argv[i + 1];
      i += 1;
    } else if (arg === "--out-dir" && argv[i + 1]) {
      flags.outDir = path.resolve(argv[i + 1]);
      i += 1;
    }
  }

  return flags;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function timestamp() {
  const now = new Date();
  const parts = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    "-",
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ];
  return parts.join("");
}

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function sanitizeText(text) {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractVisibleTextMetrics(text) {
  const lines = sanitizeText(text)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const metrics = {
    date: null,
    sessionType: null,
    clubHints: [],
    carryValues: [],
    sideValues: [],
    leftMentions: [],
    notes: [],
  };

  const dateMatch = text.match(/\b(20\d{2}[-/]\d{2}[-/]\d{2}|\d{1,2}\/\d{1,2}\/20\d{2})\b/);
  if (dateMatch) {
    metrics.date = dateMatch[1];
  }

  const sessionTypes = [
    "Practice Range",
    "Shot Analysis",
    "Combine",
    "Course",
    "Game",
    "Report",
    "Multi group report",
  ];

  metrics.sessionType = sessionTypes.find((type) => text.toLowerCase().includes(type.toLowerCase())) || null;

  for (const line of lines) {
    if (/\b(driver|4hybrid|4h|5w|7wood|7w|7iron|7i|9iron|9i)\b/i.test(line)) {
      metrics.clubHints.push(line);
    }

    if (/\bcarry\b/i.test(line) || /\btotal\b/i.test(line) || /\bside\b/i.test(line)) {
      metrics.notes.push(line);
    }

    if (/\bleft\b|\bL\b|左/i.test(line)) {
      metrics.leftMentions.push(line);
    }
  }

  const carryMatches = [...text.matchAll(/carry[^0-9\-]*([0-9]+(?:\.[0-9]+)?)/gi)];
  metrics.carryValues = carryMatches.map((match) => Number(match[1]));

  const sideMatches = [...text.matchAll(/side[^0-9\-]*([0-9]+(?:\.[0-9]+)?)([LR左右])?/gi)];
  metrics.sideValues = sideMatches.map((match) => ({
    value: Number(match[1]),
    direction: match[2] || null,
  }));

  return metrics;
}

function buildPracticeDraft({ metadata, metrics }) {
  const today = metadata.capturedAt.slice(0, 10);
  const dateValue = metrics.date || today;
  const sessionType = metrics.sessionType || "Trackman Activities";
  const clubSummary = metrics.clubHints.slice(0, 5).map((line) => `- ${line}`).join("\n");
  const noteSummary = metrics.notes.slice(0, 5).map((line) => `- ${line}`).join("\n");

  return `# 練習ログ（下書き）

- 日付: ${dateValue}
- 場所: Trackman
- 時間:

## 今日のテーマ（1つだけ）
- 1Wのミス方向を整理して本番で使える状態を作る

## 判定ルール
- 左OBにつながる球を最優先で減らす
- \`右OK・左NG\` で評価する
- 本番で \`1Wを使えるミス方向\` に整理できたかで見る

## 結論
Trackman の画面から抽出した下書きです。まずは左に出た球と左に曲がった球があったかを確認し、左OBにつながる種がゼロかどうかを最優先で判定する。

## 理由
右に逃げる球は許容できても、フックによる左OBはスコアを一気に崩しやすい。Trackman の数値は飛距離よりも \`左を消せているか\` の視点で読む。

## 具体行動（次回の練習でやること）
- [ ] フェースを返さない意識で 10 球打ち、1W の \`出球\` と \`曲がり\` を分けて数える
- [ ] 一番危険なミス（例: 左に出てさらに左）を 1 つ決める
- [ ] 1W を \`使う条件\` と \`外す条件\` を 1 つずつ決める

## 記録（数値）
- ティーショット候補クラブ:
- 1Wの主な出球ミス:
- 1Wの主な曲がりミス:
- 1Wで一番危険なミス:
- 1Wを使う条件:
- 1Wを外す条件:
- ドライバー 左ミス本数:
- ドライバー 左に曲がった本数:
- ドライバー 右ミス本数:
- ドライバー 右に曲がった本数:
- ドライバー 7割スイング実施数:
- 7I トップ本数:
- 7I クリーンヒット本数:
- 7I 左ミス本数:
- 10m超パット 1m以内率（任意）:
- 30球中の「7割スイング」実施数:

## Trackman 取り込み
- セッション種別: \`${sessionType}\`
- 取得元 URL: \`${metadata.url}\`
- キャプチャ保存先: \`${metadata.captureDir}\`
- ドライバー Carry:
- ドライバー Total:
- ドライバー 左右ブレ:
- ドライバー 左に出た球数:
- ドライバー 左に曲がった球数:
- ドライバー 右に出た球数:
- ドライバー 右に曲がった球数:
- 7I Carry:
- 7I 左右ブレ:
- 今日いちばん悪かった傾向:
- 次回も見る数字（1つ）: \`ドライバー左ミス本数\`

## 画面から拾えた候補
${clubSummary || "- 主要クラブの行は未抽出"}

## 補足メモ
${noteSummary || "- Carry / Side / Total の文字列は未抽出"}

## 本番に持ち込むルール（1つだけ）
- 1Wは封印せず、練習で整理したミス方向の範囲で使う。10m超の1stパットは1m以内を最優先にする
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  ensureDir(args.outDir);
  ensureDir(PROFILE_ROOT);

  console.log("Trackman import helper");
  console.log(`Open target: ${args.url}`);
  console.log("1. ブラウザが開いたら手でログインしてください");
  console.log("2. 取り込みたい Activities または詳細ページを表示してください");
  console.log("3. ターミナルに戻って Enter を押すと保存します");

  const context = await chromium.launchPersistentContext(PROFILE_ROOT, {
    channel: "chrome",
    headless: args.headless,
    viewport: { width: 1440, height: 1200 },
  });

  const page = context.pages()[0] || (await context.newPage());
  await page.goto(args.url, { waitUntil: "domcontentloaded" });

  await ask("\n準備できたら Enter を押してください...");

  const captureId = timestamp();
  const captureDir = path.join(args.outDir, captureId);
  ensureDir(captureDir);

  await page.screenshot({
    path: path.join(captureDir, "page.png"),
    fullPage: true,
  });

  const html = await page.content();
  fs.writeFileSync(path.join(captureDir, "page.html"), html, "utf8");

  const visibleText = sanitizeText(
    await page.evaluate(() => document.body.innerText || "")
  );
  fs.writeFileSync(path.join(captureDir, "page.txt"), `${visibleText}\n`, "utf8");

  const metadata = {
    capturedAt: new Date().toISOString(),
    url: page.url(),
    title: await page.title(),
    captureDir,
  };

  fs.writeFileSync(
    path.join(captureDir, "metadata.json"),
    `${JSON.stringify(metadata, null, 2)}\n`,
    "utf8"
  );

  const metrics = extractVisibleTextMetrics(visibleText);
  fs.writeFileSync(
    path.join(captureDir, "metrics.json"),
    `${JSON.stringify(metrics, null, 2)}\n`,
    "utf8"
  );

  const draft = buildPracticeDraft({ metadata, metrics });
  fs.writeFileSync(path.join(captureDir, "practice-log-draft.md"), draft, "utf8");

  console.log("\nSaved files:");
  console.log(`- ${path.join(captureDir, "page.png")}`);
  console.log(`- ${path.join(captureDir, "page.html")}`);
  console.log(`- ${path.join(captureDir, "page.txt")}`);
  console.log(`- ${path.join(captureDir, "metadata.json")}`);
  console.log(`- ${path.join(captureDir, "metrics.json")}`);
  console.log(`- ${path.join(captureDir, "practice-log-draft.md")}`);

  console.log("\nNext step:");
  console.log("practice-log-draft.md を開いて、Carry や左ミス本数を確認しながら正式ログに整えてください。");

  await context.close();
}

main().catch((error) => {
  console.error("\nTrackman import failed.");
  console.error(error);
  process.exitCode = 1;
});
