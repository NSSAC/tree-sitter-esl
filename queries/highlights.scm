[ "enum" ] @keyword
(enum
  name: (identifier) @type.definition
  constant: (identifier) @constant
  ("," constant: (identifier) @constant)*
)

["global" "config" "statistic"] @keyword
(global
  name: (identifier) @variable
  type: (identifier) @type
)

["node"] @keyword
(node_field
  name: (identifier) @variable.member
  type: (identifier) @type
  (node_annotation)* @annotation
)

["edge"] @keyword
(edge_field
  name: (identifier) @variable.member
  type: (identifier) @type
  (edge_annotation)* @annotation
)

[ "contagion"
  "transition"
  "transmission"
] @keyword
[
  "susceptibility" "infectivity" "transmissibility"
  "transition probability" "dwell time"
] @attribute

[ "def" "lambda" ] @keyword
(function
  name: (identifier) @function
  type: (identifier)? @type
)
(parameter
  name: (identifier) @variable.parameter
  type: (identifier) @type
)

(lambda_function
  type: (identifier)? @type
)
(lambda_parameter
  name: (identifier) @variable.parameter
  type: (identifier)? @type
)

[
 "if" "elif" "else"
 "switch" "case" "default"
] @keyword.conditional
[ "return" ] @keyword.return
[ "while" ] @keyword.repeat
[
  "from"
  "filter" "sample" "apply" "reduce"
] @keyword.directive
(assignment_statement type: (identifier) @type)

[ "ABSOLUTE" "RELATIVE" ] @constant.builtin

((identifier) @variable.builtin
  (#match? @variable.builtin "^(CUR_TICK)$"))

((identifier) @constant.builtin
  (#match? @constant.builtin "^(NUM_TICKS|NUM_NODES|NUM_EDGES)$"))

; ((identifier) @function.builtin
;   (#match? @function.builtin "^(len)$"))

(boolean) @boolean
(integer) @number
(float) @number.float
(string) @string

(comment) @comment

[
 "+"
 "-"
 "*"
 "/"
 "%"
 "or"
 "and"
 "not"
 "=="
 "!="
 ">"
">="
 "<="
 "<"
 "="
 "*="
 "/="
 "%="
 "+="
 "-="
] @operator

[
 "(" ")"
 "{" "}"
] @punctuation.bracket

[
 "->"
 "=>"
 ":"
 ","
 ";"
] @punctuation.special

[ "end" ] @keyword
