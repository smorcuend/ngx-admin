
const { resolve, relative } = require('path');
const { writeFileSync } = require('fs-extra');

const gitInfo = {
  tag: require('./package.json').version
};

const versionInfoJson = JSON.stringify(gitInfo, null, 2);

const file = resolve(__dirname, 'git-version.json');
writeFileSync(file, versionInfoJson, { encoding: 'utf-8' });

// tslint:disable-next-line:no-console
console.log(`Wrote version info ${gitInfo.raw} to ${relative(resolve(__dirname, '..'), file)}`);
