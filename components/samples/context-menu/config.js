window.MathJax = {
    loader: {
        load: ["input/tex", "output/chtml", "ui/menu"],
        paths: {
            mathjax: '../../dist'
        },
        failed: (error) => {
            console.log(`MathJax(${error.package || '?'}): ${error.message}`);
            if (error.stack) console.log(error.stack);
        }
    },
    chtml: {
        fontURL: 'https://cdn.rawgit.com/mathjax/mathjax-v3/3.0.0-beta.3/mathjax2/css'
    },
    tex: {
        inlineMath: [['$','$']]
    }
};
