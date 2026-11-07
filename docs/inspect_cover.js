const fs = require('fs');
const xml = fs.readFileSync('docs/docx_document.xml', 'utf8');

const pMatches = xml.match(/<w:p[\s>].*?<\/w:p>/gs) || [];

for (let i = 0; i < Math.min(30, pMatches.length); i++) {
  const p = pMatches[i];
  const jc = p.match(/<w:jc w:val="([^"]+)"/)?.[1] || 'left';
  const tMatches = p.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
  const text = tMatches.map(t => t.replace(/<[^>]+>/g, '')).join('');
  const b = p.includes('<w:b/>') || p.includes('<w:b ') ? 'BOLD' : 'NORM';
  const sz = p.match(/<w:sz w:val="([^"]+)"/)?.[1] || 'default';
  console.log(`[P${i+1}] align=${jc} b=${b} sz=${sz} :: ${text}`);
}
