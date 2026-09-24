const fs = require('fs');

const content = fs.readFileSync('public/webapps/diagnostico_7mo_modulo01_cyberquest.html', 'utf8');

// Print cognitive questions
const qStart = content.indexOf('const cognitiveQuestions = [');
if (qStart !== -1) {
  const qEnd = content.indexOf('];', qStart);
  const qStr = content.substring(qStart + 'const cognitiveQuestions = '.length, qEnd + 1);
  const qs = JSON.parse(qStr);
  console.log('=== PREGUNTAS COGNITIVAS ===');
  qs.forEach((q, i) => {
    console.log(`\nQ${i+1}: [${q.subarea}] "${q.title}"`);
    console.log(`Pregunta: "${q.question}"`);
    q.options.forEach((opt, oi) => {
      console.log(`   ${oi}: "${opt}"`);
    });
  });
}
