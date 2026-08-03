// lib/noteCounts.ts — 프로젝트별 관련 노트 수를 빌드 시점에 센다.
//
// WHY 별도 모듈인가: fs를 쓰므로 서버에서만 실행할 수 있다. lib/projects.ts는
//   클라이언트 컴포넌트(Projects.tsx 등)에서도 import하므로 여기에 두면 번들이 깨진다.
//
// WHY 건수를 세는가: "관련 노트"만 있으면 눌러볼 이유가 약하다. "관련 노트 143개"는
//   그 자체가 축적의 증거라 클릭 동기가 된다. 그리고 0건이면 링크를 숨겨야 하는데,
//   숨길지 판단하려면 세는 것 말고 방법이 없다.
import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { NOTE_PROJECT } from "./projects";

/** 노트의 `project` 프론트매터에서 위키링크 표기를 벗긴다. `"[[Align AI]]"` → `Align AI` */
const stripWiki = (v: unknown): string | null => {
  if (v == null) return null;
  const s = Array.isArray(v) ? String(v[0] ?? "") : String(v);
  return s.replace(/\[\[|\]\]/g, "").trim() || null;
};

/** project 태그별 노트 수. 한 번 읽어 캐시한다(빌드 중 여러 페이지가 호출한다). */
let cache: Map<string, number> | null = null;

function countsByTag(): Map<string, number> {
  if (cache) return cache;
  const counts = new Map<string, number>();
  const dir = path.join(process.cwd(), "content/notes");
  if (!fs.existsSync(dir)) return (cache = counts);

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    let tag: string | null = null;
    try {
      tag = stripWiki(matter(fs.readFileSync(path.join(dir, file), "utf8")).data.project);
    } catch {
      continue; // 프론트매터가 깨진 노트는 건너뛴다 — 집계가 실패할 이유는 없다
    }
    if (tag) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return (cache = counts);
}

/** 슬러그에 대응하는 관련 노트 수. 매핑이 없거나 노트가 없으면 0. */
export function noteCountFor(slug: string): number {
  const tag = NOTE_PROJECT[slug];
  if (!tag) return 0;
  return countsByTag().get(tag) ?? 0;
}
