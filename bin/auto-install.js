const { execSync } = require('child_process');
const changedFiles = execSync('git diff-tree -r --name-only --no-commit-id HEAD@{1} HEAD').toString().split(/\r|\n/);

if (changedFiles && changedFiles.includes('package.json')) {
  execSync('npm install', {
    stdio: 'inherit'
  });
}
