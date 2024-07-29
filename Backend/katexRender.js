const katex = require('katex');

const renderKaTeX = (latexString) => {
    try {
        return katex.renderToString(latexString, {
            throwOnError: false,
            displayMode: true
        });
    } catch (error) {
        console.error("KaTeX rendering error: ", error);
        return latexString; // Return the raw string if there's an error
    }
};

module.exports = renderKaTeX;
