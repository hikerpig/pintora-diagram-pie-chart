@preprocessor typescript
@lexer lexer
@builtin "whitespace.ne"
@builtin "number.ne"

@{%
import * as moo from '@hikerpig/moo'
import type { Action, NearleyParserResult } from '../parser'

let lexer = moo.compile({
  NL: { match: /[\n\r]/, lineBreaks: true }, // new line
  WS: { match: / +/, lineBreaks: false }, // white space
  TITLE: { match: /title/ }, // keyword title
  QUOTED_WORD: /\"[^"]*\"/,
  WORD: { match: /(?:[a-zA-Z0-9_]\p{Unified_Ideograph})+/, fallback: true } ,
})

/** get token value */
function tv(token) {
  if (token && 'value' in token) return token.value
  return token
}

/** get inner string from a QUOTED_WORD token */
function getQuotedString(t) {
  const v = tv(t)
  return v.slice(1, v.length - 1)
}

%}

start -> __ start {% (d) => d[1] %}
  | "pie" document {%
      (d) => {
        return d[1] as NearleyParserResult
      }
    %}

document -> null
  | document statementWrap {%
      (d) => {
        let r: NearleyParserResult = d[0]
        if (d[1]) {
          r = d[0].concat(d[1])
        }
        return r
      }
    %}
  | __ document {% (d) => d[1] %}

# handles leading spaces and empty lines
statementWrap ->
    %WS:? statement {% (d) => {
      return d[1] as Action
    } %}
  | %WS:? %NL {% null %}

# real statement
statement ->
    %TITLE %WS words %WS:? %NL {%
      (d) => {
        return { type: "title", title: d[2] } as Action
      }
    %}
  | %QUOTED_WORD %WS decimal %WS:? %NL {%
      (d) => {
        const name = getQuotedString(d[0])
        return { type: "record", name, count: d[2] } as Action
      }
    %} # `"peach" 5`

# words and spaces
words ->
    (%WORD | %WS):+ {%
      (d) => {
        return d[0].map(a => a[0]).map(o => tv(o)).join('')
      }
    %}