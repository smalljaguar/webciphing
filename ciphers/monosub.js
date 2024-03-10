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
  let m = (n + 26) % 26;
  return key.slice(m) + key.slice(0, m);
}

function rotateKeyInPlace() {
  // rotate key by n places
  let n = Number(document.getElementById("rotate").value);
  let key = document.getElementById("key").value;
  document.getElementById("key").value = rotateKey(key, n);
}
document
  .getElementById("rotate-key")
  .addEventListener("click", rotateKeyInPlace);

function swapChars(key, a, b) {
  // swap 2 letters in key
  let keylist = key.split("");
  let a_i = keylist.indexOf(a);
  let b_i = keylist.indexOf(b);
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
document
  .getElementById("swap-chars")
  .addEventListener("click", swapCharsInPlace);

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

// if this isn't good enough, can use trigrams
// also not in any way optimized for performance btw
function chiSquared(text) {
  let char_freqs = [
    0.08167, 0.01492, 0.02782, 0.04253, 0.12702, 0.02228, 0.02015, 0.06094,
    0.06966, 0.00153, 0.00772, 0.04025, 0.02406, 0.06749, 0.07507, 0.01929,
    0.00095, 0.05987, 0.06327, 0.09056, 0.02758, 0.00978, 0.0236, 0.0015,
    0.01974, 0.00074,
  ];
  let total = 0;
  for (let c = 0; c < 26; c++) {
    let char = "abcdefghijklmnopqrstuvwxyz".charAt(c);
    let observed = count(text, char);
    let expected = char_freqs[c] * text.length;
    total += Math.pow(observed - expected, 2) / expected;
  }
  return total;
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

function smartMonoDecrypt(text) {
  // algorithm is hill-climbing
  // for each iteration, swap 2 letters
  // if score increases, keep swap, otherwise revert
  key = "abcdefghijklmnopqrstuvwxyz";
  let topScore = chiSquared(monoDecrypt(text, key));
  let plainText;
  console.log(key, topScore);
  if (key.length != 26) {
    throw "Key must be 26 characters long";
  }
  // chisquared isn't good enough for this
  // TODO: implement trigrams scoring func
  // also very obvious perf improvements can be made
  // e.g. swapping indices instead of letters, speeding up monoDecrypt
  // also caching chiSquared results
  for (let x = 0; x < 5; x++) {
    for (let i = 0; i < key.length; i++) {
      for (let j = i + 1; j < key.length; j++) {
        key = swapChars(key, key[i], key[j]);
        plainText = monoDecrypt(text, key);
        if (chiSquared(plainText) < topScore) {
          topScore = chiSquared(plainText);
        } else {
          key = swapChars(key, key[i], key[j]);
        }
      }
    }
  }
  console.log(key, topScore);
  return key;
}

function encryptText(text, key) {
  text = text.toLowerCase();
  key = key.toLowerCase().replace(/[^a-z]/g, "");
  let cipherText = monoEncrypt(text, key);
  document.getElementById("result").innerHTML = cipherText;
}
document.getElementById("decrypt").addEventListener("click", function () {
  decryptText(
    document.getElementById("input").value,
    document.getElementById("key").value
  );
});

function decryptText(text, key) {
  key = key.toLowerCase();
  text = text.toLowerCase();
  key = key.replace(/[^a-z]/g, "");
  let plainText = monoDecrypt(text, key);
  document.getElementById("result").innerHTML = plainText;
}
document.getElementById("encrypt").addEventListener("click", function () {
  encryptText(
    document.getElementById("input").value,
    document.getElementById("key").value
  );
});

function smartDecryptText(text) {
  let key = smartMonoDecrypt(text);
  let plainText = monoDecrypt(text, key);
  document.getElementById("result").innerHTML = plainText;
}
document.getElementById("smart-decrypt").addEventListener("click", function () {
  smartDecryptText(document.getElementById("input").value);
});

function reverseKey(key) {
  let reversed = Object.entries(key).map((kv) => kv.reverse());
  return Object.fromEntries(reversed);
}

function shuffleKey() {
  let key = document.getElementById("key").value;
  let shuffled = key
    .split("")
    .map((v) => [v, Math.random()])
    .sort((a, b) => a[1] - b[1])
    .map((v) => v[0])
    .join("");
  document.getElementById("key").value = shuffled;
}
document.getElementById("shuffle-key").addEventListener("click", shuffleKey);
