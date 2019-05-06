#!/bin/bash

if [ $# -eq 0 ]; then 

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

    # AMS package tests.
    node load.js tests/parser-ams-tests.js
    node load.js tests/parser-amsenv-tests.js
    node load.js tests/parser-amserror-tests.js
    node load.js tests/parser-amscomplex-tests.js

    # The tag tests.
    node load.js tests/parser-tag-none-tests.js
    node load.js tests/parser-tag-ams-tests.js
    node load.js tests/parser-tag-all-tests.js

    node load.js tests/parser-multline-shove-tests.js

    node load.js tests/parser-matrix-tests.js

    # Other packages
    node load.js tests/parser-noundefined-tests.js
    node load.js tests/parser-boldsymbol-tests.js
    node load.js tests/parser-newcommand-tests.js
    node load.js tests/parser-ncerrors-tests.js

    node load.js tests/parser-braket-tests.js

    node load.js tests/parser-mhchem0-tests.js
    node load.js tests/parser-mhchem1-tests.js
    node load.js tests/parser-mhchem2-tests.js
    node load.js tests/parser-mhchem3-tests.js
    node load.js tests/parser-mhchem4-tests.js
    node load.js tests/parser-mhchem5-tests.js
    node load.js tests/parser-mhchem6-tests.js
    node load.js tests/parser-mhchem7-tests.js
    node load.js tests/parser-mhchem8-tests.js
    node load.js tests/parser-mhchem9-tests.js

    node load.js tests/parser-noerrors-tests.js

    node load.js tests/parser-amscd-tests.js

    ## Physics package.
    node load.js tests/parser-physics-1-0-test.js
    node load.js tests/parser-physics-1-1-test.js
    node load.js tests/parser-physics-1-2-test.js
    node load.js tests/parser-physics-1-3-test.js
    node load.js tests/parser-physics-1-4-test.js
    node load.js tests/parser-physics-1-5-test.js
    node load.js tests/parser-physics-1-6-test.js
    node load.js tests/parser-physics-1-7-test.js
    node load.js tests/parser-physics-2-0-test.js
    node load.js tests/parser-physics-2-1-test.js
    node load.js tests/parser-physics-2-2-test.js
    node load.js tests/parser-physics-2-3-test.js
    node load.js tests/parser-physics-2-4-test.js
    node load.js tests/parser-physics-2-5-test.js
    node load.js tests/parser-physics-2-6-test.js
    node load.js tests/parser-physics-2-7-test.js
    node load.js tests/parser-physics-3-0-test.js
    node load.js tests/parser-physics-3-1-test.js
    node load.js tests/parser-physics-3-2-test.js
    node load.js tests/parser-physics-3-3-test.js
    node load.js tests/parser-physics-3-4-test.js
    node load.js tests/parser-physics-3-5-test.js
    node load.js tests/parser-physics-3-6-test.js
    node load.js tests/parser-physics-3-7-test.js
    node load.js tests/parser-physics-4-0-test.js
    node load.js tests/parser-physics-5-0-test.js
    node load.js tests/parser-physics-5-1-test.js
    node load.js tests/parser-physics-5-2-test.js
    node load.js tests/parser-physics-5-3-test.js
    node load.js tests/parser-physics-5-4-test.js
    node load.js tests/parser-physics-5-5-test.js
    node load.js tests/parser-physics-6-0-test.js
    node load.js tests/parser-physics-6-1-test.js
    node load.js tests/parser-physics-6-2-test.js
    node load.js tests/parser-physics-6-3-test.js
    node load.js tests/parser-physics-6-4-test.js
    node load.js tests/parser-physics-7-0-test.js
    node load.js tests/parser-physics-7-1-test.js
    node load.js tests/parser-physics-7-2-test.js
    node load.js tests/parser-physics-7-3-test.js
    node load.js tests/parser-physics-7-4-test.js
    node load.js tests/parser-physics-7-5-test.js
    node load.js tests/parser-physics-7-6-test.js
    node load.js tests/parser-physics-7-7-test.js
    node load.js tests/parser-physics-7-8-test.js
    node load.js tests/parser-physics-7-9-test.js
    node load.js tests/parser-physics-7-10-test.js
    node load.js tests/parser-physics-7-11-test.js 
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
