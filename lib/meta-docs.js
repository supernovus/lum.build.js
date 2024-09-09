/**
 * Build meta-documentation files
 * 
 * Generally used to convert Markdown docs in the source tree
 * into HTML files that the generated API documentation can reference.
 * 
 * That includes a special version of the README file that has any
 * references to `.md` replaced with `.html` for relative URL links.
 * 
 */
"use strict";

const fs = require('node:fs');
const marked = require('marked');
const {S,F} = require('@lumjs/core/types/basics');

const MD = '.md';
const HTML = '.html';
const mdExt = (text) => text.replaceAll(MD, HTML);
const fsOpts = {encoding: 'utf8'}

/**
 * Build directories (recursively, synchronously)
 * @param {object} rules - Build rules
 * @param {string[]} [rules.dirs] Directories to build
 * 
 * Each item is a pathname, relative to the project root.
 */
function mkdirs(rules)
{
  if (Array.isArray(rules.dirs))
  {
    for (const dir of rules.dirs)
    {
      fs.mkdirSync(dir, {recursive: true});
    }
  }
}

/**
 * Build an extra doc file (asynchronously)
 * 
 * @param {object} file - File spec
 * @param {string} file.from - Source file path
 * 
 * If this ends in `.md` the source file will be considered Markdown.
 * 
 * @param {string} file.to - Destination file path
 * 
 * If this ends in `.html` the output should be HTML; combined with a
 * `file.from` ending in `.md`, the Markdown parser will be enabled.
 * 
 * The detination directory must exist already. So use `mkdirs` first!
 * 
 * @param {function} [file.before] A custom script ran *before* any
 * built-in parsing is performed.
 * 
 * Will be passed the content as a string, and must return the
 * updated content as a string.
 * 
 * There is no default for this option; if it's not specified
 * there will simply be no pre-processing done.
 * 
 * @param {(function|false)} [file.after] A custom script ran *after*
 * any built-in parsing is performed.
 * 
 * Will be passed the content as a string, and must return the
 * updated content as a string.
 * 
 * If the `file.from` ends in `.md`, then this has a default implementation 
 * that simply replaces any reference to `.md` with `.html` in the document 
 * content; designed to ensure URL links point to the correct place.
 * 
 * If you want to disable the default for a single file, set this to `false`.
 * If you want to disable the default for all files, see `rules.replaceExt`.
 * 
 * If you want to use a custom function *and* the default, the default
 * function is exported as `mdExt`.
 * 
 * @param {string} [file.header] An HTML header for this Markdown doc
 * @param {string} [file.footer] An HTML footer for this Markdown doc
 * 
 * @param {object} rules - Build rules
 * @param {number} [rules.verbose=1] Verbosity level
 * @param {string} [rules.header] A default HTML header for Markdown docs
 * @param {string} [rules.footer] A default HTML footer for Markdown docs
 * @param {boolean} [rules.replaceExt] Set this to `false` to disable
 * the default `file.after` function for source files ending in `.md`.
 * 
 */
function docFile(file, rules)
{
  const V = rules.verbose ?? 1;

  if (V) console.log("←", file.from);

  const fromMD = file.from.endsWith(MD);
  const toHTML = file.to.endsWith(HTML);
  const doExt  = rules.replaceExt ?? fromMD;
  const before = file.before;
  const after  = file.after ?? (fromMD ? mdExt : null);
  const header = file.header ?? rules.header;
  const footer = file.footer ?? rules.footer;

  fs.readFile(file.from, fsOpts, (err, data) =>
  {
    if (err) 
    {
      console.error(err);
      return;
    }

    if (typeof before === F)
    { // Pre-processing
      data = before(data);
    }

    if (fromMD && toHTML)
    { // Render markdown to HTML
      if (V) console.log("«md-to-html»", file.from);
      data = marked.parse(data);

      if (typeof header === S)
      {
        data = header + data;
      }
      if (typeof footer === S)
      {
        data += footer;
      }
    }

    if (typeof after === F)
    { // Post-processing
      if (V) console.log("«update»", file.from);
      data = after(data);
    }

    // Now save the updated content to the destination file.
    fs.writeFile(file.to, data, fsOpts, (err) => 
    {
      if (err)
      {
        console.error(err);
      }
      else if (V)
      {
        console.log("→", file.to);
      }
    });
  });
} // docFile(file)

/**
 * Build extra documentation files (asynchronously)
 * @param {object} rules - Build rules
 * @param {object[]} [rules.files] File specs to build;
 * Each spec will be passed to `docFile()`
 */
function docFiles(rules)
{
  if (Array.isArray(rules.files))
  {
    for (const file of rules.files)
    {
      docFile(file, rules);
    }
  }
}

module.exports =
{
  fsOpts, mdExt, mkdirs, docFile, docFiles,
}
