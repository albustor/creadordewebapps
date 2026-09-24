const fs = require('fs');

const content = fs.readFileSync('public/webapps/diagnostico_7mo_modulo01_cyberquest.html', 'utf8');

// Find all HTML tags with text, headings, buttons, badges, descriptions
const matches = [];

// Find lines containing titles, headings, badges, labels
const lines = content.split('\n');
lines.forEach((line, lineNo) => {
  if (line.includes('class="card-title"') || line.includes('class="mission-badge') || line.includes('class="btn-') || line.includes('phaseNames') || line.includes('dim-badge') || line.includes('step-item')) {
    matches.push(`L${lineNo+1}: ${line.trim()}`);
  }
});

console.log('--- FOUND UI TEXT LINES ---');
console.log(matches.slice(0, 50).join('\n'));

// Extract questions block
const qStart = content.indexOf('const cognitiveQuestions = [');
if (qStart !== -1) {
  const qEnd = content.indexOf('];', qStart);
  const qStr = content.substring(qStart + 'const cognitiveQuestions = '.length, qEnd + 1);
  const qs = JSON.parse(qStr);
  console.log('\n--- QUESTIONS SUMMARY ---');
  qs.forEach((q, i) => {
    console.log(`\n[Item ${i+1}] Subárea: ${q.subarea} | Título: ${q.title}`);
    console.log(`Pregunta: ${q.question}`);
    q.options.forEach((opt, oi) => {
      console.log(`  (${oi+1}) ${opt}`);
    });
  });
}
