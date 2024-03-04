function count(string) {
    var count = {};
    string.split("").forEach(function (s) {
        count[s] ? count[s]++ : (count[s] = 1);
    });
    return count;
}

function IOC(text) {
    // IOC = Σ (fi * (fi - 1)) / (N * (N - 1))
    let counterValues = Object.values(count(text));
    let ioc =
        counterValues.map((fi) => fi * (fi - 1)).reduce((a, b) => a + b) /
        (text.length * (text.length - 1));
    return ioc;
    // alert("Index of coincidence is: "+ioc.toFixed(5));
}

function chiSquared(text) {}
function getSlices(text, n) {
    // get n slices of text, each with stride n
    let slices = Array(n).fill("");
    for (let i = 0; i < text.length; i++) {
        slices[i % n] += text[i];
    }
    return slices;
}
function steppedIOC(text) {
    englishIOC = 0.065;
    // for stepped ioc, take text with stride 1 thru min(text.length/2,n) where n is upper bound for keylen
    // say 10
    // then calculate IOC for each of these texts, and find most extreme IOC
    let n = Math.min(Math.floor(text.length / 2), 10);
    let iocs = [...Array(n).keys()].map((i) =>
        getSlices(text, i + 1)
            .map((slice) => IOC(slice))
            .reduce((a, b) =>
                Math.abs(a - englishIOC) < Math.abs(b - englishIOC) ? a : b
            )
    );
    // calculate range in iocs
    let range = Math.max(...iocs) - Math.min(...iocs);
    // take index with IOC closest to englishIOC while preserving index
    bestIOC = iocs.reduce((a, b) =>
        Math.abs(a - englishIOC) < Math.abs(b - englishIOC) ? a : b
    );
    bestIdx = iocs.indexOf(bestIOC);
    return [bestIOC.toFixed(5), bestIdx + 1, range.toPrecision(3)];
}

function missingCharacters(text) {
    return "abcdefghijklmnopqrstuvwxyz"
        .split("")
        .filter((c) => !text.includes(c));
}

function analyseText(text) {
    // format string containing:
    // IOC, Chi-squared, Stepped IOC, and missing characters
    // then appends to div with id "analysis"
    let analysis = "<ul>";
    analysis += `<li>Index of Coincidence: ${IOC(text).toFixed(5)}</li>`;
    let [bestIOC, bestKeylen, range] = steppedIOC(text);
    analysis += `<li>Best Keylength is ${bestKeylen} (IOC is ${bestIOC}) with range ${range} </li>`;
    let missingChars = missingCharacters(text).length
        ? missingCharacters(text).join("")
        : "None";
    analysis += `<li>Missing characters: ${missingChars}</li>`;
    analysis += "</ul>";
    document.getElementById("result").innerHTML = analysis;
}
