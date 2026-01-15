import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getGraphData() {
  const notesDirectory = path.join(process.cwd(), 'content/notes');
  const nodes: any[] = [{ id: 'me', label: 'HOSUGATOR', level: 0, color: '#00f3ff' }];
  const links: any[] = [];

  if (!fs.existsSync(notesDirectory)) return { nodes, links };

  function walk(currentPath: string, parentId: string) {
    const items = fs.readdirSync(currentPath);

    items.forEach((item) => {
      const fullPath = path.join(currentPath, item);
      const isDirectory = fs.statSync(fullPath).isDirectory();
      const id = fullPath.split('content/notes/')[1] || item;

      if (isDirectory) {
        nodes.push({ id, label: item.toUpperCase(), level: 1, color: '#94a3b8', parentId });
        links.push({ source: parentId, target: id });
        walk(fullPath, id);
      } else if (item.endsWith('.md')) {
        const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
        nodes.push({
          id,
          label: data.title || item.replace('.md', ''),
          level: 2,
          color: '#e2e8f0',
          content,
          parentId
        });
        links.push({ source: parentId, target: id });
      }
    });
  }

  walk(notesDirectory, 'me');
  return { nodes, links };
}