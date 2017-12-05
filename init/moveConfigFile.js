const os = require('os');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const ssaccmgrPath = path.resolve(os.homedir(), './.ssaccmgr/');

const configFiles = [
  'default.yml',
];

const log4js = require('log4js');
const logger = log4js.getLogger('system');

try {
  fs.statSync(ssaccmgrPath);
} catch(err) {
  logger.info('~/.ssaccmgr/ not found, make dir for it.');
  fs.mkdirSync(ssaccmgrPath);
}
configFiles.forEach(configFile => {
  try {
    fs.statSync(path.resolve(ssaccmgrPath, configFile));
  } catch(err) {
    logger.info(`~/.ssaccmgr/${ configFile } not found, make file for it.`);
    fse.copySync(path.resolve(`./config/${ configFile }`), path.resolve(ssaccmgrPath, configFile));
  }
});
