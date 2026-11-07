const fs = require('fs');
const xml = fs.readFileSync('docs/docx_document.xml', 'utf8');

// Find all image references: r:embed="rIdX"
const matches = xml.match(/<w:drawing>.*?<\/w:drawing>/gs) || [];
console.log('Total drawings in docx:', matches.length);

const relsXml = fs.readFileSync('docs/docx_extracted/word/_rels/document.xml.rels', 'utf8');
const rIdMap = {};
for (const rel of relsXml.match(/<Relationship[^>]+>/g) || []) {
  const id = rel.match(/Id="([^"]+)"/)?.[1];
  const target = rel.match(/Target="([^"]+)"/)?.[1];
  if (id && target) rIdMap[id] = target;
}

for (let i = 0; i < matches.length; i++) {
  const d = matches[i];
  const blip = d.match(/r:embed="([^"]+)"/)?.[1];
  const target = blip ? rIdMap[blip] : 'unknown';
  console.log(`Drawing ${i+1}: blip=${blip} target=${target}`);
}
