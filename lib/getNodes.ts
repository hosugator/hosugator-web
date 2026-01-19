// lib/getNodes.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getGraphData() {
  const notesDirectory = path.join(process.cwd(), 'content/notes');
  // 중앙 노드를 hosugator로 고정
  const nodes: any[] = [{ id: 'hosugator', label: 'HOSUGATOR', level: 0 }];
  const links: any[] = [];

  if (!fs.existsSync(notesDirectory)) return { nodes, links };

  function walk(currentPath: string, parentId: string) {
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
        nodes.push({
          id,
          label: data.title || item.replace('.md', ''),
          level: 2,
          content,
          parentId
        });
        links.push({ source: parentId, target: id });
      }
    });
  }

  walk(notesDirectory, 'hosugator');
  return { nodes, links };
}