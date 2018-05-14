const STRING = (adaptor, item, delim) => {
    const {node, n} = item;
    const value = adaptor.value(node);
    return (value.substr(0, n) + delim + value.substr(n)).replace(/\n/g, '\\n');
};

const DELIMITERS = (adaptor, start, end) => {
    const value = adaptor.value(start.node);
    const [n, m] = [start.n, end.n];
    return (value.substr(0, n) + '[[' + value.substr(n, m - n) + ']]' + value.substr(m)).replace(/\n/g, '\\n');
};

export const printFound = (html) => {
    const adaptor = html.adaptor;
    for (const math of html.math) {
        console.log(math.math, math.display);
        if (math.start.node === math.end.node) {
            console.log('=> ', DELIMITERS(adaptor, math.start, math.end));
        } else {
            console.log('>> ', STRING(adaptor, math.start, '[['));
            console.log('<< ', STRING(adaptor, math.end, ']]'));
        }
    }
}
