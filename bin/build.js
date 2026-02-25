#!/usr/bin/env node
// Must be run from the project root!
"use strict";

const { cwd, path } = require('../lib/runtime');
const md = require('../lib/meta-docs');
const Builder = require('../lib/rule-builder');
const { isObj } = require('@lumjs/core/types/basics');
const rulesConf = require(path.join(cwd, 'lum.build'));

let rules, retval = null;

if (typeof rulesConf === 'function')
{
  rules = new Builder();
  retval = rulesConf.call(md, rules);
}
else if (isObj(rulesConf))
{ 
  if (typeof rulesConf.run === 'function')
  {
    rules = new Builder(rulesConf);
    retval = rulesConf.run(rules, md);
  }
  else
  { // Fall back on the conf being the rules
    rules = rulesConf;
  }
}
else
{
  console.error({rulesConf});
  throw new TypeError("Invalid export from lum.build.js");
}

if (rules.debug)
{
  console.debug({rules, retval, files: rules.files});
}

if (!rules.done)
{
  md.runAll(isObj(retval) ? retval : rules);
}

