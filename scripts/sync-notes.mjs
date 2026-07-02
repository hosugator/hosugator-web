// scripts/sync-notes.mjs
// ~/zettelkasten 에서 `publish: true` 프론트매터를 가진 노트만
// content/notes/ 로 평평하게(flat) 복사한다.
//   실행: node scripts/sync-notes.mjs   (또는 npm run sync:notes)
//   볼트 경로 오버라이드: VAULT=/path/to/vault node scripts/sync-notes.mjs
import fs from 'fs';
import path from 'path';
import os from 'os';
import matter from 'gray-matter';

const VAULT = process.env.VAULT || path.join(os.homedir(), 'zettelkasten');
const DEST = path.join(process.cwd(), 'content', 'notes');

if (!fs.existsSync(VAULT)) {
  console.error(`✗ 볼트를 찾을 수 없습니다: ${VAULT}`);
  process.exit(1);
}

// content/notes 초기화 (공개분만 다시 채운다 → 미공개 노트 자동 제외)
fs.rmSync(DEST, { recursive: true, force: true });
fs.mkdirSync(DEST, { recursive: true });

let published = 0;
let scanned = 0;
const byCategory = {};

for (const file of fs.readdirSync(VAULT)) {
  if (!file.endsWith('.md')) continue; // daily-log/templates 등 하위폴더는 제외(루트 노트만)
  scanned++;
  const src = path.join(VAULT, file);
  let data;
  try {
    ({ data } = matter(fs.readFileSync(src, 'utf8')));
  } catch {
    continue;
  }
  if (data.publish !== true) continue;

  fs.copyFileSync(src, path.join(DEST, file));
  published++;
  const cat = (data.subject ? String(data.subject).replace(/\[\[|\]\]/g, '').trim() : '') || 'general';
  byCategory[cat] = (byCategory[cat] || 0) + 1;
}

console.log(`\n✓ ${published} / ${scanned} notes published → content/notes/`);
const summary = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}(${v})`).join('  ·  ');
if (summary) console.log(`  branches: ${summary}\n`);
if (published === 0) console.log('  ⚠ publish: true 인 노트가 없습니다. 볼트 노트에 publish: true 를 추가하세요.\n');
