function makeKey(key) {
    if (key.length != 26) {
        throw "Key must be 26 characters long";
    }
    let keymapping = "abcdefghijklmnopqrstuvwxyz"
        .split("")
        .map((c, i) => [c, key[i]]);
    // convert to dict, not strictly necessary but easier
    return Object.fromEntries(keymapping);
}

function rotateKey(key, n) {
    // rotate key by n places
    console.log(n);
    let m = (n + 26) % 26;
    // WTF??
    console.log(m);
    return key.slice(m) + key.slice(0, m);
}

function rotateKeyInPlace() {
    // rotate key by n places
    let n = document.getElementById("rotate").value;
    let key = document.getElementById("key").value;
    document.getElementById("key").value = rotateKey(key, n);
}

function swapChars(key, a, b) {
    // swap 2 letters in key
    let keylist = key.split("");
    a_i = keylist.indexOf(a);
    b_i = keylist.indexOf(b);
    keylist[a_i] = b;
    keylist[b_i] = a;
    return keylist.join("");
}

function swapCharsInPlace() {
    // swap 2 letters in key
    let a = document.getElementById("swap1").value;
    let b = document.getElementById("swap2").value;
    let key = document.getElementById("key").value;
    document.getElementById("key").value = swapChars(key, a, b);
}

function monoEncrypt(text, key) {
    let keymap = makeKey(key);
    return text
        .split("")
        .map((c) => (keymap[c] ? keymap[c] : c))
        .join("");
}

function monoDecrypt(text, key) {
    let keymap = reverseKey(makeKey(key));
    return text
        .split("")
        .map((c) => (keymap[c] ? keymap[c] : c))
        .join("");
}

function smartMonoDecrypt(text) {
    // TODO implement this
    // algorithm is hill-climbing
    // for each iteration, swap 2 letters
    // if score increases, keep swap, otherwise revert
    // score is based on ngram frequency
    // (this will be the hard part, might try and make a homemade bundler to avoid modules)
}

function encryptText(text, key) {
    key = key.toLowerCase();
    text = text.toLowerCase();
    key = key.replace(/[^a-z]/g, "");
    cipherText = monoEncrypt(text, key);
    document.getElementById("result").innerHTML = cipherText;
}

function decryptText(text, key) {
    key = key.toLowerCase();
    text = text.toLowerCase();
    key = key.replace(/[^a-z]/g, "");
    plainText = monoDecrypt(text, key);
    document.getElementById("result").innerHTML = plainText;
}

function reverseKey(key) {
    let reversed = Object.entries(key).map((kv) => kv.reverse());
    return Object.fromEntries(reversed);
}
