const fs = require('fs');
const xml = fs.readFileSync('docs/docx_document.xml', 'utf8');

const pMatches = xml.match(/<w:p[\s>].*?<\/w:p>/gs) || [];
console.log('Total paragraphs found:', pMatches.length);

const lines = [];
for (const p of pMatches) {
  const tMatches = p.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
  const text = tMatches.map(t => t.replace(/<[^>]+>/g, '')).join('');
  if (text.trim().length > 0) {
    lines.push(text.trim());
  }
}

fs.writeFileSync('docs/docx_text.txt', lines.join('\n'), 'utf8');
console.log('Saved docs/docx_text.txt with', lines.length, 'lines.');
