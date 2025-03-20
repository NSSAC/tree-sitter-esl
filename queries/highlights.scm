[ "enum" ] @keyword
(enum
  name: (identifier) @type.definition
  constant: (identifier) @constant
  ("," constant: (identifier) @constant)*
)

["global" "config" "statistic"] @keyword
(global
  name: (identifier) @variable
  type: (reference)? @type
)

["node"] @keyword
(node_field
  name: (identifier) @variable.member
  type: (reference) @type
  (node_annotation)* @annotation
)

["edge"] @keyword
(edge_field
  name: (identifier) @variable.member
  type: (reference) @type
  (node_annotation)* @annotation
)

[ "distribution" ] @keyword
(discrete_dist
  ["discrete" ] @keyword
  name: (identifier) @function
)
(discrete_pv ["p" "v"] @parameter.builtin)
(normal_dist
  ["normal"] @keyword
  name: (identifier) @function
  ["mean" "std" "min" "max"] @parameter.builtin
)
(uniform_dist
  ["uniform"] @keyword
  name: (identifier) @function
  ["low" "high"] @parameter.builtin
)

[ "contagion"
  "transition"
  "transmission"
] @keyword
[
  "state type"
  "susceptibility" "infectivity" "transmissibility"
] @attribute
(transition ["p" "dwell"] @attribute)

[ "def" "lambda" ] @keyword
(function
  name: (identifier) @function
  type: (reference)? @type
)
(lambda_function
  type: (reference)? @type
)
(parameter
  name: (identifier) @variable.parameter
  type: (reference)? @type
)

[
 "if" "elif" "else"
 "switch" "case" "default"
] @keyword.conditional
[ "return" ] @keyword.return
[ "while" ] @keyword.repeat
[
  "from" "node" "edge"
  "filter" "sample" "apply" "reduce"
] @keyword.directive
(assignment_statement type: (reference) @type)

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
