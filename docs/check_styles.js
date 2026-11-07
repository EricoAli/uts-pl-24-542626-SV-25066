const fs = require('fs');

if (fs.existsSync('docs/docx_extracted/word/fontTable.xml')) {
  const fontXml = fs.readFileSync('docs/docx_extracted/word/fontTable.xml', 'utf8');
  console.log('FontTable fonts:', fontXml.match(/w:name="([^"]+)"/g));
}

if (fs.existsSync('docs/docx_extracted/word/styles.xml')) {
  const stylesXml = fs.readFileSync('docs/docx_extracted/word/styles.xml', 'utf8');
  console.log('Styles fonts:', stylesXml.match(/w:rFonts[^>]+/g));
  console.log('Sample font sizes:', stylesXml.match(/w:sz w:val="([^"]+)"/g)?.slice(0, 5));
}
