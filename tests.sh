#!/bin/bash

if [ $# -eq 0 ]; then

    node load.js tests/tex-keyval-tests.js

    node load.js tests/parser-base-tests.js
    node load.js tests/parser-digits-tests.js
    node load.js tests/parser-digits-european-tests.js
    node load.js tests/parser-other-tests.js
    node load.js tests/parser-fenced-tests.js
    node load.js tests/parser-movlim-tests.js
    node load.js tests/parser-mathchoice-tests.js
    node load.js tests/parser-multirel-tests.js
    node load.js tests/parser-array-tests.js
    node load.js tests/parser-error-tests.js
    node load.js tests/parser-complex-tests.js
    node load.js tests/parser-internal-math-tests.js
    node load.js tests/parser-multline-shove-tests.js
    node load.js tests/parser-matrix-tests.js


    # AMS package tests.
    node load.js tests/parser-ams-tests.js
    node load.js tests/parser-amsenv-tests.js
    node load.js tests/parser-amserror-tests.js
    node load.js tests/parser-amscomplex-tests.js

    # The tag tests.
    node load.js tests/parser-tag-none-tests.js
    node load.js tests/parser-tag-ams-tests.js
    node load.js tests/parser-tag-all-tests.js

    # Other standard packages
    node load.js tests/parser-action-tests.js
    node load.js tests/parser-amscd-tests.js
    node load.js tests/parser-bbox-tests.js
    node load.js tests/parser-boldsymbol-tests.js
    node load.js tests/parser-cancel-tests.js
    node load.js tests/parser-cancel-tests.js
    node load.js tests/parser-enclose-tests.js
    node load.js tests/parser-extpfeil-tests.js
    node load.js tests/parser-html-tests.js
    node load.js tests/parser-ncerror-tests.js
    node load.js tests/parser-newcommand-tests.js
    node load.js tests/parser-noerror-tests.js
    node load.js tests/parser-noundefined-tests.js
    node load.js tests/parser-unicode-tests.js
    node load.js tests/parser-verb-tests.js

    # BraKet package.
    node load.js tests/parser-braket-tests.js

    # mhchem package.
    node load.js tests/parser-mhchem-0-tests.js
    node load.js tests/parser-mhchem-1-tests.js
    node load.js tests/parser-mhchem-2-tests.js
    node load.js tests/parser-mhchem-3-tests.js
    node load.js tests/parser-mhchem-4-tests.js
    node load.js tests/parser-mhchem-5-tests.js
    node load.js tests/parser-mhchem-6-tests.js
    node load.js tests/parser-mhchem-7-tests.js
    node load.js tests/parser-mhchem-8-tests.js
    node load.js tests/parser-mhchem-9-tests.js

    ## Physics package.
    node load.js tests/parser-physics-1-0-tests.js
    node load.js tests/parser-physics-1-1-tests.js
    node load.js tests/parser-physics-1-2-tests.js
    node load.js tests/parser-physics-1-3-tests.js
    node load.js tests/parser-physics-1-4-tests.js
    node load.js tests/parser-physics-1-5-tests.js
    node load.js tests/parser-physics-1-6-tests.js
    node load.js tests/parser-physics-1-7-tests.js
    node load.js tests/parser-physics-2-0-tests.js
    node load.js tests/parser-physics-2-1-tests.js
    node load.js tests/parser-physics-2-2-tests.js
    node load.js tests/parser-physics-2-3-tests.js
    node load.js tests/parser-physics-2-4-tests.js
    node load.js tests/parser-physics-2-5-tests.js
    node load.js tests/parser-physics-2-6-tests.js
    node load.js tests/parser-physics-2-7-tests.js
    node load.js tests/parser-physics-3-0-tests.js
    node load.js tests/parser-physics-3-1-tests.js
    node load.js tests/parser-physics-3-2-tests.js
    node load.js tests/parser-physics-3-3-tests.js
    node load.js tests/parser-physics-3-4-tests.js
    node load.js tests/parser-physics-3-5-tests.js
    node load.js tests/parser-physics-3-6-tests.js
    node load.js tests/parser-physics-3-7-tests.js
    node load.js tests/parser-physics-4-0-tests.js
    node load.js tests/parser-physics-5-0-tests.js
    node load.js tests/parser-physics-5-1-tests.js
    node load.js tests/parser-physics-5-2-tests.js
    node load.js tests/parser-physics-5-3-tests.js
    node load.js tests/parser-physics-5-4-tests.js
    node load.js tests/parser-physics-5-5-tests.js
    node load.js tests/parser-physics-6-0-tests.js
    node load.js tests/parser-physics-6-1-tests.js
    node load.js tests/parser-physics-6-2-tests.js
    node load.js tests/parser-physics-6-3-tests.js
    node load.js tests/parser-physics-6-4-tests.js
    node load.js tests/parser-physics-7-0-tests.js
    node load.js tests/parser-physics-7-1-tests.js
    node load.js tests/parser-physics-7-2-tests.js
    node load.js tests/parser-physics-7-3-tests.js
    node load.js tests/parser-physics-7-4-tests.js
    node load.js tests/parser-physics-7-5-tests.js
    node load.js tests/parser-physics-7-6-tests.js
    node load.js tests/parser-physics-7-7-tests.js
    node load.js tests/parser-physics-7-8-tests.js
    node load.js tests/parser-physics-7-9-tests.js
    node load.js tests/parser-physics-7-10-tests.js
    node load.js tests/parser-physics-7-11-tests.js

    exit 0
else
    repeat=$1
fi

i=0
sum=0
while [ $i -lt $repeat ]
do
    sum=$(( $sum + `node load.js tests/parser-tests.js | tail -1 | awk -Fm '{print $1}'`))
    i=$(( $i + 1 ))
done

echo 'Total: ' $sum
average=`bc -l <<< "($sum / $repeat)"`
echo 'Average: ' $average
