#!/bin/bash

if [ $# -eq 0 ]; then 
    node load.js tests/parser-base-tests.js
    node load.js tests/parser-other-tests.js
    node load.js tests/parser-fenced-tests.js
    node load.js tests/parser-movlim-tests.js
    node load.js tests/parser-mathchoice-tests.js
    node load.js tests/parser-multirel-tests.js
    node load.js tests/parser-array-tests.js
    node load.js tests/parser-error-tests.js
    node load.js tests/parser-complex-tests.js
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
