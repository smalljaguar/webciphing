function encryptText(text, shift) {
    text = text.toLowerCase();
    let result = "";
    for (let i = 0; i < text.length; i++) {
        let c = text.charCodeAt(i);
        if (c >= 97 && c <= 122) {
            result += String.fromCharCode(((c - 97 + shift) % 26) + 97);
        } else {
            result += text.charAt(i);
        }
    }
    document.getElementById("result").innerHTML = result;
}

function decrypt(text, shift) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        let c = text.charCodeAt(i);
        if (c >= 97 && c <= 122) {
            result += String.fromCharCode(((c - 97 - shift + 26) % 26) + 97);
        } else {
            result += text.charAt(i);
        }
    }
    return result;
}
function decryptText(text, shift) {
    document.getElementById("result").innerHTML = decrypt(text, shift);
}
function count(text, char) {
    let count = 0;
    for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) == char) {
            count++;
        }
    }
    return count;
}

function chiSquared(text) {
    let char_freqs = [
        0.08167, 0.01492, 0.02782, 0.04253, 0.12702, 0.02228, 0.02015, 0.06094,
        0.06966, 0.00153, 0.00772, 0.04025, 0.02406, 0.06749, 0.07507, 0.01929,
        0.00095, 0.05987, 0.06327, 0.09056, 0.02758, 0.00978, 0.0236, 0.0015,
        0.01974, 0.00074,
    ];
    total = 0;
    for (let c = 0; c < 26; c++) {
        char = "abcdefghijklmnopqrstuvwxyz".charAt(c);
        observed = count(text, char);
        expected = char_freqs[c] * text.length;
        total += Math.pow(observed - expected, 2) / expected;
    }
    return total;
}

function smartDecryptText(text) {
    console.log(
        [...Array(26).keys()]
            .map((shift) => decrypt(text, shift))
            .map(chiSquared)
    );
    let out = [...Array(26).keys()]
        .map((shift) => decrypt(text, shift))
        .reduce((min, current) =>
            chiSquared(current) < chiSquared(min) ? current : min
        );
    document.getElementById("result").innerHTML = out;
}
