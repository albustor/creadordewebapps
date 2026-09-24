const fs = require('fs');

function cleanCssTextTransform(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/\.cyber-title\s*\{([^}]*?)text-transform:\s*uppercase;?/g, '.cyber-title {\$1');
  content = content.replace(/\.mission-badge\s*\{([^}]*?)text-transform:\s*uppercase;?/g, '.mission-badge {\$1');
  content = content.replace(/\.cadet-role-tag\s*\{([^}]*?)text-transform:\s*uppercase;?/g, '.cadet-role-tag {\$1');
  content = content.replace(/\.form-label\s*\{([^}]*?)text-transform:\s*uppercase;?/g, '.form-label {\$1');
  content = content.replace(/\.stat-card-title\s*\{([^}]*?)text-transform:\s*uppercase;?/g, '.stat-card-title {\$1');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned text-transform in ${filePath}`);
}

cleanCssTextTransform('public/webapps/diagnostico_7mo_modulo01_cyberquest.html');
cleanCssTextTransform('public/webapps/diagnostico_7mo_modulo01_desconectado_offline.html');
