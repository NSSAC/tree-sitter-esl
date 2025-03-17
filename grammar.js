/**
 * @file A domain specific language for creating high performance epidemic simulators.
 * @author Parantapa Bhattacharya <parantapa@virginia.edu>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "esl",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
