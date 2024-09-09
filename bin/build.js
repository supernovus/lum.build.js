#!/usr/bin/env node
// Must be run from the project root!
"use strict";

const process = require('node:process');
const cwd = process.cwd();
const md = require('../lib/meta-docs');
const rules = require(cwd+'/lum.build');

md.mkdirs(rules);
md.docFiles(rules);
