// lib/getNodes.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface Node {
  id: string;
  label: string;
  level: number;
  content?: string;
  parentId?: string;
  date?: string;
  tags?: string[];
  type?: string;
  project?: string;
  category?: string;
}

// 위키링크("[[X]]") · 배열 → 순수 문자열
const stripWiki = (v: unknown): string | undefined => {
  if (v == null) return undefined;
  const s = Array.isArray(v) ? String(v[0] ?? '') : String(v);
  const cleaned = s.replace(/\[\[|\]\]/g, '').trim();
  return cleaned || undefined;
};

interface Link {
  source: string;
  target: string;
}

export function getGraphData() {
  const notesDirectory = path.join(process.cwd(), 'content/notes');
  // 중앙 노드를 hosugator로 고정
  const nodes: Node[] = [{ id: 'hosugator', label: 'HOSUGATOR', level: 0 }];
  const links: Link[] = [];

  if (!fs.existsSync(notesDirectory)) return { nodes, links };

  function walk(currentPath: string, parentId: string): void {
    const items = fs.readdirSync(currentPath);

    items.forEach((item) => {
      const fullPath = path.join(currentPath, item);
      const isDirectory = fs.statSync(fullPath).isDirectory();
      // ID 추출 로직 (폴더 구조 유지)
      const id = fullPath.split('content/notes/')[1] || item;

      if (isDirectory) {
        // 1레벨 노드 (카테고리 폴더)
        nodes.push({ id, label: item.toUpperCase(), level: 1, parentId });
        links.push({ source: parentId, target: id });
        walk(fullPath, id);
      } else if (item.endsWith('.md')) {
        // 2레벨 노드 (개별 노트 파일)
        const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
        const date = data.date || data.created || data.updated || undefined;
        const tags = Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []);
        // category = frontmatter subject 우선, 없으면 폴더 최상위 fallback
        const category = stripWiki(data.subject) || (id.includes('/') ? id.split('/')[0] : undefined) || 'general';
        nodes.push({
          id,
          label: data.title || item.replace('.md', ''),
          level: 2,
          content,
          parentId,
          date: date ? String(date) : undefined,
          tags,
          type: data.type || undefined,
          project: stripWiki(data.project),
          category,
        });
        links.push({ source: parentId, target: id });
      }
    });
  }

  walk(notesDirectory, 'hosugator');
  return { nodes, links };
}
