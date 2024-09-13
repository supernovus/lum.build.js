/**
 * Some common snippets for jsdoc.js config files
 */
"use strict";

const def = require('@lumjs/core/types/def');
const cp = require('@lumjs/core/obj/cp');

const libPath = "./lib";

const defaults =
{
  tags: 
  {
    allowUnknownTags: false
  },
  source:
  {
    include: [libPath]
  },
  opts: 
  {
    destination: "./docs/api",
    template: "node_modules/docdash",
    package: "package.json",
    recurse: true
  },
  plugins: 
  [
    "plugins/markdown"
  ],
  templates: 
  {
    cleverLinks: false,
    monospaceLinks: false,
    default: 
    {
      outputSourceFiles: true,
      useLongnameInNav: true
    },
    navType: "vertical",
    linenums: true,
    dateFormat: "YYYY-MM-DD, hh:mm:ss"
  },
  docdash:
  {
    collapse: true,
    commonNav: true,
    private: false,
    search: false,
    sectionOrder:
    [
      "Modules",
      "Namespaces",
      "Classes",
      "Interfaces",
      "Mixins",
      "Events",
      "Externals",
      "Tutorials"
    ],
    shortenTypes: false,
    scopeInOutputPath: false,
    nameInOutputPath: false,
    versionInOutputPath: false
  }
}

const readmeRootPath = "README.md"
const readmeDocsPath = "docs/build/README.md";
const docSrcPath     = "./docs/src";
const singleFilePath = "./index.js";

const readme = (readme) => ({opts: {readme}});

const srcDocs =
{
  source:
  {
    include: [libPath, docSrcPath],
  }
}

const singleFile =
{
  source:
  {
    include: [singleFilePath],
  }
}

const rules =
{
  defaults,libPath,docSrcPath,srcDocs,
  readme,readmeRootPath,readmeDocsPath,
}

const cloner = cp.from(defaults).ow.deep;
def(cloner)
  ('RULES',      rules)
  ('rootReadme', {get() { return this.and(readme(readmeRootPath)) }})
  ('docsReadme', {get() { return this.and(readme(readmeDocsPath)) }})
  ('srcDocs',    {get() { return this.and(srcDocs) }})
  ('singleFile', {get() { return this.and(singleFile) }})
;

module.exports = cloner;
