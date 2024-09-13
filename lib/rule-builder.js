"use strict";

const path = require('node:path');
const Meta = require('./meta-docs');

const D_BUILD = 'docs/build';
const D_API   = 'docs/api';
const README  = 'README.md';
const HEADER  = '<html><body>';
const FOOTER  = '</body></html>';

class RuleBuilder
{
  constructor(opts={})
  {
    this.outDir = opts.outDir ?? D_API;
    this.subDir = opts.subDir ?? '';
    this.header = opts.header ?? HEADER;
    this.footer = opts.footer ?? FOOTER;
    this.dirs   = new Set();
    this.files  = [];
    this.done   = false;
    this.opts   = opts;
  }

  get readme()
  {
    this.dirs.add(D_BUILD);
    this.files.push(
    {
      from: README, 
      to:   path.join(D_BUILD, README),
    });
    return this;
  }

  chdir(subdir)
  {
    this.subDir = subdir ?? '';
    return this;
  }

  add(filename, opts)
  {
    const spec = Object.assign({}, opts);

    spec.from = path.join(this.subDir, filename);
    spec.to   = path.join(this.outDir, this.subDir, filename);

    if (filename.endsWith('.md'))
    { // Gonna convert markdown into HTML
      spec.to = spec.to.replace(/\.md$/, '.html');
    }

    this.files.push(spec);
    this.dirs.add(path.dirname(spec.to));

    return this;
  }

  set(key, val)
  {
    this[key] = val;
    return this;
  }

  run(md=Meta)
  {
    md.runAll(this);
    this.done = true;
  }

}

module.exports = RuleBuilder;
