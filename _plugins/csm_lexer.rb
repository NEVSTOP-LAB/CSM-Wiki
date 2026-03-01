# frozen_string_literal: true

require 'rouge'

module Rouge
  module Lexers
    class CSM < RegexLexer
      title 'CSM'
      desc 'Communicable State Machine (CSM) script language'
      tag 'csm'
      filenames '*.csm'
      mimetypes 'text/x-csm'

      # Special token patterns used in both rule definitions and lookaheads
      SEND_SEP  = /->\||->|-@/
      ARG_SEP   = />>/
      COMMENT   = /\/\//
      SPECIAL   = /#{ARG_SEP}|#{SEND_SEP}|#{COMMENT}/

      state :root do
        # Single-line comment: // to end of line
        rule %r{#{COMMENT}[^\n]*}, Comment::Single

        # >> separator: command / argument boundary; switch to argument state
        rule %r{#{ARG_SEP}}, Operator, :argument

        # Send separators: ->|  ->  -@  (order matters: ->| before ->)
        rule %r{#{SEND_SEP}}, Keyword, :target

        # Whitespace (including newlines)
        rule %r{\s+}, Text

        # @target embedded in a command (e.g. cmd@Module) — bold label
        rule %r{@(?:(?!#{SPECIAL})[^\s])+}, Name::Label

        # Command text: any non-whitespace sequence that does not begin
        # one of the special tokens above, stopping before @
        rule %r{(?:(?!#{SPECIAL})[^\s@])+}, Name::Function
      end

      state :argument do
        # Inline comment ends the argument
        rule %r{#{COMMENT}[^\n]*}, Comment::Single, :pop!

        # Newline ends the argument
        rule %r{\n}, Text, :pop!

        # Lookahead for a send separator: pop without consuming it
        rule %r{(?=#{SEND_SEP})}, Text, :pop!

        # Non-newline whitespace
        rule %r{[^\S\n]+}, Text

        # @target embedded in an argument (e.g. arg@Module) — bold, harmonises with argument style
        rule %r{@(?:(?!#{SPECIAL})[^\s])+}, Literal::String::Interpol

        # Argument tokens (lighter + italic via CSS), stopping before SPECIAL tokens
        rule %r{(?:(?!#{SPECIAL})[^\s@])+}, Literal::String::Doc
      end

      state :target do
        # Inline comment ends the target
        rule %r{#{COMMENT}[^\n]*}, Comment::Single, :pop!

        # Newline ends the target
        rule %r{\n}, Text, :pop!

        # Non-newline whitespace
        rule %r{[^\S\n]+}, Text

        # Target module name — plain Text so it renders in default (black) colour.
        # No :pop! so multi-word names (e.g. "Module A") are fully captured here.
        rule %r{\S+}, Text
      end
    end
  end
end
