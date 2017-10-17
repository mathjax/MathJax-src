#! /bin/bash
## Depends on typescript 1.7.3

SCRIPT=`dirname $0`/..
BASE=`pwd -P`/$SCRIPT
SRC=$BASE/mathjax3-ts
DOCTMP=$BASE/graphs/tmp
DOT=$DOCTMP/dot
DOC=$BASE/graphs
SIMPLE=class-diagram-simple
SIMPLEDOT=$DOT/$SIMPLE.dot
SIMPLESVG=$DOC/$SIMPLE.svg
COMPLEX=class-diagram-complete
COMPLEXDOT=$DOT/$COMPLEX.dot
COMPLEXSVG=$DOC/$COMPLEX.svg

rm -rf $DOT
mkdir -p $DOT

node -e "require('$BASE/tools/class_parser.js'); classParser.classGraph('$SRC/', '$SIMPLEDOT'); classParser.methodGraph('$SRC/', '$COMPLEXDOT');"

dot -Tsvg $SIMPLEDOT > $SIMPLESVG
dot -Tsvg $COMPLEXDOT > $COMPLEXSVG

