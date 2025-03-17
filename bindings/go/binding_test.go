package tree_sitter_esl_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_esl "github.com/nssac/tree-sitter-esl/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_esl.Language())
	if language == nil {
		t.Errorf("Error loading Epidemic Simulator Language grammar")
	}
}
