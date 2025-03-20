/**
 * @file A domain specific language for creating high performance epidemic simulators.
 * @author Parantapa Bhattacharya <parantapa@virginia.edu>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  LOGICAL_OR: 1,
  LOGICAL_AND: 2,
  EQUAL: 3,
  RELATIONAL: 4,
  ADD: 5,
  MULTIPLY: 6,
  UNARY: 7,
  CALL: 8,
};

module.exports = grammar({
  name: "esl",

  word: $ => $.identifier,

  rules: {
    source_file: $ => repeat(choice(
      $.enum,
      $.global,
      $.node,
      $.edge,
      $.distributions,
      $.contagion,
      $.function,
      $.test_statement,
      $.test_expression
    )),

    enum: $ => seq(
      'enum',
      field('name', $.identifier),
      field('constant', commaSep1($.identifier)),
      'end'
    ),

    global: $ => seq(
      field('category', choice('global', 'config', 'statistic')),
      field('name', $.identifier),
      optional(seq(
        ':',
        field('type', $.reference)
      )),
      '=',
      field('default', $._expression),
    ),

    node: $ => seq(
      'node',
      field('field', repeat1($.node_field)),
      'end'
    ),

    node_field: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $.reference),
      field('annotation', repeat($.node_annotation)),
    ),

    node_annotation: _ => token(choice(
      alias(/node\s+key/, 'node key'),
      'static',
      'save'
    )),

    edge: $ => seq(
      'edge',
      field('field', repeat1($.edge_field)),
      'end'
    ),

    edge_field: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $.reference),
      field('annotation', repeat($.edge_annotation)),
    ),

    edge_annotation: _ => token(choice(
      alias(/target\s+node\s+key/, 'target node key'),
      alias(/source\s+node\s+key/, 'source node key'),
      'static',
      'save'
    )),

    distributions: $ => seq(
      'distribution',
      repeat($._distribution),
      'end'
    ),

    _distribution: $ => choice(
      $.discrete_dist,
      $.normal_dist,
      $.uniform_dist
    ),

    discrete_dist: $ => seq(
      'discrete',
      field('name', $.identifier),
      field('pv', repeat($.discrete_pv)),
      'end'
    ),

    discrete_pv: $ => seq(
      'p', '=', field('p', $._expression), ',',
      'v', '=', field('v', $._expression),
    ),

    normal_dist: $ => seq(
      'normal',
      field('name', $.identifier),
      'mean', '=', field('mean', $._expression), ',',
      'std', '=', field('std', $._expression),
      optional(seq(',', 'min', '=', field('min', $._expression))),
      optional(seq(',', 'max', '=', field('max', $._expression))),
      'end'
    ),

    uniform_dist: $ => seq(
      'uniform',
      field('name', $.identifier),
      'low', '=', field('low', $._expression), ',',
      'high', '=', field('high', $._expression),
      'end'
    ),

    contagion: $ => seq(
      'contagion',
      field('name', $.identifier),
      field('body', repeat(choice(
        $.contagion_state_type,
        $.contagion_function,
        $.transitions,
        $.transmissions,
      ))),
      'end'
    ),

    contagion_state_type: $ => seq(
      alias(/state\s+type/, 'state type'),
      field('type', $.reference),
    ),

    contagion_function: $ => seq(
      field('type', choice('susceptibility', 'infectivity', 'transmissibility')),
      field('function', $._expression),
    ),

    transitions: $ => seq(
      'transition',
      field('body', repeat($.transition)),
      'end'
    ),

    transition: $ => seq(
      field('entry', $.reference), '->',
      field('exit', $.reference), ',',
      optional(seq('p', '=', field('p', $._expression), ',')),
      'dwell', '=', field('dwell', $._expression),
    ),

    transmissions: $ => seq(
      'transmission',
      field('body', repeat($.transmission)),
      'end'
    ),

    transmission: $ => seq(
      field('contact', $.reference), '=>',
      field('entry', $.reference), '->',
      field('exit', $.reference),
    ),

    function: $ => seq(
      'def',
      field('name', $.identifier),
      '(',
      field('parameter', commaSep($.parameter)),
      ')',
      optional(seq('->', field('type', $.reference))),
      ':',
      field('body', repeat1($._statement)),
      'end'
    ),

    lambda_function: $ => seq(
      'lambda',
      '(',
      field('parameter', commaSep($.parameter)),
      ')',
      optional(seq('->', field('type', $.reference))),
      '{',
      field('body', repeat1($._statement)),
      '}'
    ),

    parameter: $ => seq(
      field('name', $.identifier),
      optional(seq(':', field('type', $.reference)))
    ),

    test_statement: $ => seq(
      '__test', 'statement', ':',
      repeat1($._statement),
      'end'
    ),

    _statement: $ => choice(
      $.pass_statement,
      $.call_statement,
      $.return_statement,
      $.if_statement,
      $.switch_statement,
      $.while_loop,
      $.assignment_statement,
      $.update_statement,
      $.parallel_statement
    ),

    pass_statement: _ => 'pass',

    call_statement: $ => $.function_call,

    return_statement: $ => seq(
      'return',
      $._expression,
    ),

    if_statement: $ => seq(
      'if',
      field('condition', $._expression),
      ':',
      field('body', repeat1($._statement)),
      field('elif', repeat($.elif_section)),
      field('else', optional($.else_section)),
      'end'
    ),

    elif_section: $ => seq(
      'elif',
      field('condition', $._expression),
      ':',
      field('body', repeat1($._statement))
    ),

    else_section: $ => seq(
      'else', ':',
      field('body', repeat1($._statement))
    ),

    switch_statement: $ => seq(
      'switch',
      field('condition', $._expression),
      ':',
      field('case', repeat1($.case_section)),
      field('default', optional($.default_section)),
      'end'
    ),

    case_section: $ => seq(
      'case',
      field('match', $._expression),
      ':',
      field('body', repeat1($._statement))
    ),

    default_section: $ => seq(
      'default', ':',
      field('body', repeat1($._statement))
    ),

    while_loop: $ => seq(
      'while',
      field('condition', $._expression),
      ':',
      field('body', repeat1($._statement)),
      'end'
    ),

    assignment_statement: $ => seq(
      field('lvalue', $.reference),
      optional(seq(':', field('type', $.reference))),
      '=',
      field('rvalue', $._expression),
    ),

    update_statement: $ => seq(
      field('lvalue', $.reference),
      field('operator', choice(
        '*=',
        '/=',
        '%=',
        '+=',
        '-=',
      )),
      field('rvalue', $._expression),
    ),

    parallel_statement: $ => seq(
      'from', field('table', choice('node', 'edge')),
      optional($.filter_clause),
      optional($.sample_clause),
      choice(
        $.apply_clause,
        repeat1($.reduce_clause)
      ),
    ),

    filter_clause: $ => seq(
      'filter',
      field('function', $._expression)
    ),

    sample_clause: $ => seq(
      'sample',
      field('type', choice('ABSOLUTE', 'RELATIVE')),
      field('amount', $._expression),
    ),

    apply_clause: $ => seq(
      'apply',
      field('function', $._expression)
    ),

    reduce_clause: $ => seq(
      'reduce',
      field('lvalue', $.reference),
      field('operator', choice('+', '*',)),
      '=',
      field('function', $._expression)
    ),

    test_expression: $ => seq(
      '__test', 'expression', ':',
      field('expression', $._expression),
      'end'
    ),

    _expression: $ => choice(
      $.integer,
      $.float,
      $.boolean,
      $.string,
      $.reference,
      $.unary_expression,
      $.binary_expression,
      $.parenthesized_expression,
      $.function_call,
      $.lambda_function,
    ),

    unary_expression: $ => prec.left(PREC.UNARY, seq(
      field('operator', choice('not', '-', '+')),
      field('argument', $._expression),
    )),

    binary_expression: $ => {
      const table = [
        ['+', PREC.ADD],
        ['-', PREC.ADD],
        ['*', PREC.MULTIPLY],
        ['/', PREC.MULTIPLY],
        ['%', PREC.MULTIPLY],
        ['or', PREC.LOGICAL_OR],
        ['and', PREC.LOGICAL_AND],
        ['==', PREC.EQUAL],
        ['!=', PREC.EQUAL],
        ['>', PREC.RELATIONAL],
        ['>=', PREC.RELATIONAL],
        ['<=', PREC.RELATIONAL],
        ['<', PREC.RELATIONAL],
      ];

      return choice(...table.map(([operator, precedence]) => {
        return prec.left(precedence, seq(
          field('left', $._expression),
          field('operator', operator),
          field('right', $._expression),
        ));
      }));
    },

    parenthesized_expression: $ => seq(
      '(',
      field('expression', $._expression),
      ')'
    ),

    function_call: $ => prec(PREC.CALL, seq(
      field('function', $.reference),
      '(',
      field('argument', commaSep($._expression)),
      ')'
    )),

    reference: $ => dotSep1($.identifier),

    identifier: _ => /[a-zA-Z][_a-zA-Z0-9]*/,

    integer: _ => token(repeat1(/[0-9]+/)),

    float: _ => {
      const digits = repeat1(/[0-9]+/);
      const exponent = seq(/[eE][\+-]?/, digits);

      return token(seq(
        choice(
          seq(digits, '.', optional(digits), optional(exponent)),
          seq(optional(digits), '.', digits, optional(exponent)),
          seq(digits, exponent),
        ),
      ));
    },


    boolean: _ => choice('True', 'False'),

    string: _ => token(seq(
      '"',
      repeat(choice(
        token.immediate(/[^\\"\n]+/),
        seq(
          '\\',
          choice(
            /[^xuU]/,
            /\d{2,3}/,
            /x[0-9a-fA-F]{2,}/,
            /u[0-9a-fA-F]{4}/,
            /U[0-9a-fA-F]{8}/,
          ),
        )
      )),
      '"'
    )),

    comment: _ => token(seq('#', /.*/)),

    _whitespace: _ => /\s/,

    _optional_semicolon: _ => ';'
  },

  extras: $ => [
    $.comment,
    $._whitespace,
    $._optional_semicolon
  ]
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function dotSep1(rule) {
  return seq(rule, repeat(seq('.', rule)));
}
