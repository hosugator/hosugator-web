import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getGraphData() {
  const notesDirectory = path.join(process.cwd(), 'content/notes');
  if (!fs.existsSync(notesDirectory)) return { nodes: [], links: [] };

  const nodes: any[] = [{ id: 'me', label: 'HOSUGATOR', level: 0, color: '#00f3ff' }];
  const links: any[] = [];

  // 1. 최상위 폴더(카테고리) 목록 읽기
  const categories = fs.readdirSync(notesDirectory).filter(file => 
    fs.statSync(path.join(notesDirectory, file)).isDirectory()
  );

  categories.forEach(category => {
    // 카테고리 노드 추가 (Level 1)
    nodes.push({ id: category, label: category.toUpperCase(), level: 1, color: '#94a3b8' });
    links.push({ source: 'me', target: category });

    // 2. 각 카테고리 내부의 마크다운 파일 읽기
    const categoryPath = path.join(notesDirectory, category);
    const files = fs.readdirSync(categoryPath).filter(fn => fn.endsWith('.md'));

    files.forEach(fileName => {
      const fullPath = path.join(categoryPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const id = `${category}/${fileName}`;

      nodes.push({
        id,
        label: data.title || fileName.replace('.md', ''),
        level: 2,
        color: '#e2e8f0',
        content: content, // 팝업에서 보여줄 내용
        category: category
      });
      links.push({ source: category, target: id });
    });
  });

  return { nodes, links };
}