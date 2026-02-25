'use strict';

const cwd = process.cwd();
const fs = require('node:fs/promises');
const path = require('node:path');
const pkgFile = path.join(cwd, 'package.json');
const project = require(pkgFile);

module.exports = {
  cwd, fs, path, pkgFile, project,
}
