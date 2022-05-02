@preprocessor typescript
@lexer lexer
@builtin "whitespace.ne"
@builtin "number.ne"

@{%

import * as moo from '@hikerpig/moo'
import type { Action } from '../parser'

let lexer = moo.compile({
  NL: { match: /[\n\r]/, lineBreaks: true },
  WS: { match: / +/, lineBreaks: false },
  TITLE: { match: /title/ },
  QUOTED_WORD: /\"[^"]*\"/,
  WORD: { match: /(?:[a-zA-Z0-9_]\p{Unified_Ideograph})+/, fallback: true } ,
})

/** token value */
function tv(token) {
  if (token && 'value' in token) return token.value
  return token
}

function getQuotedString(t) {
  const v = tv(t)
  return v.slice(1, v.length - 1)
}

%}

start -> __ start {% (d) => d[1] %}
  | "pie" document {%
      function(d) {
        return d[1]
      }
    %}

document -> null
  | document statementWrap {%
    function(d) {
      let r = d[0]
      if (d[1]) {
        r = d[0].concat(d[1])
      }
      return r
    }
  %}

statementWrap ->
    %WS:? statement {% (d) => {
      return d[1]
    } %}
  | %WS:? %NL {% null %}

statement ->
    %TITLE %WS words %WS:? %NL {%
      function(d) {
        return { type: "title", title: d[2] } as Action
      }
    %}
  | %QUOTED_WORD %WS decimal %WS:? %NL {%
      function(d) {
        const name = getQuotedString(d[0])
        return { type: "record", name, count: d[2] } as Action
      }
    %}

identifier -> [a-zA-Z0-9_]:+

words -> (%WORD | %WS):+ {%
      function(d) {
        return d[0].map(a => a[0]).map(o => tv(o)).join('')
      }
    %}