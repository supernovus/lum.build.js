'use strict';

const { fs, pkgFile, project } = require('./runtime');

const EXPS = {
  CJS: 'require',
  ESM: 'import',
}

const EXTS = {
  CJS: '.cjs',
  ESM: '.mjs',
}

const DEF = 'default';
const PJE = './package.json';
const IND = 'index';

const IS_ESM = (project.type === 'module');
EXPS.ALT = IS_ESM ? EXPS.CJS : EXPS.ESM;
EXPS.DEF = IS_ESM ? EXPS.ESM : EXPS.CJS;

class ProjectHelper {
  constructor(parent) {
    this.back = parent;
    this.exports = {};
    this.altdir = null;
    this.altext = IS_ESM ? EXTS.CJS : EXTS.ESM;
    this.srcext = '.js';
    this.srcdir = './lib';
    this.typext = '.d.ts';
    this.typdir = null;
    this.withJson = true;
  }

  add(name) {
    let ename = (name === IND) ? '.' : './'+name;
    let spath = this.srcdir+'/'+name+this.srcext; 

    if (typeof this.typdir === 'string') {
      let types = this.typdir+'/'+name+this.typext;
      let exps = this.exports[ename] = {types};
      if (this.altdir) {
        let apath = this.altdir+'/'+name+this.altext;
        exps[EXPS.DEF] = spath;
        exps[EXPS.ALT] = apath;
      }
      else {
        exps[DEF] = spath;
      }
    }
    else {
      this.exports[ename] = spath;
    }

    return this;
  }

  alt(dir, ext) {
    this.altdir = dir;
    if (typeof ext === 'string') {
      this.altext = ext;
    }
    return this;
  }

  src(dir, ext) {
    if (typeof dir === 'string') {
      this.srcdir = dir;
    }
    if (typeof ext === 'string') {
      this.srcext = ext;
    }
    return this;
  }

  types(dir, ext) {
    this.typdir = dir;
    if (typeof ext === 'string') {
      this.typext = ext;
    }
    return this;
  }

  save(onSave) {
    let exps = this.exports;
    if (this.withJson) {
      exps[PJE] = PJE;
    }
    project.exports = exps;

    let json = JSON.stringify(project, null, 2);
    fs.writeFile(pkgFile, json).then(res => {
      if (typeof onSave === 'function') {
        onSave.call(this, res);
      }
    });
  }

}

module.exports = ProjectHelper;
