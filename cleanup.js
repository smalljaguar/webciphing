import { logwordfreqs } from "./modules/count_1w_rounded.js";

// imports have to be toplevel
function copyToClipboard() {
  var textarea = document.getElementById("input");
  textarea.select();
  navigator.clipboard
    .writeText(textarea.value)
    .then(function () {
      alert("Text copied to clipboard!");
    })
    .catch(function (error) {
      console.error("Failed to copy text: ", error);
    });
}
function copyFromClipboard() {
  // not supported by firefox
  navigator.clipboard
    .readText()
    .then(function (text) {
      var textarea = document.getElementById("input");
      textarea.value = text;
    })
    .catch(function (error) {
      console.error("Failed to read text: ", error);
    });
}
function toLower() {
  var textarea = document.getElementById("input");
  textarea.value = textarea.value.toLowerCase();
}
function toUpper() {
  var textarea = document.getElementById("input");
  textarea.value = textarea.value.toUpperCase();
}

function removeNonAlpha() {
  var textarea = document.getElementById("input");
  textarea.value = textarea.value.replace(/[^a-zA-Z]/g, "");
}

// all of this is copied from 2023ciphing/ciphers.py for reference
// count_1w has raw data, count_1w.json has processed data (logfreqs etc.)
// with brotli compression ratio is ~4

// may have issues with recursion limit, unfortunately JS can't change it

function cache(func) {
  var memo = {};
  return function (text) {
    if (memo[text] === undefined) {
      memo[text] = func(text);
    }
    return memo[text];
  };
}

// @memo
// def segment(text):
// "Return a list of words that is the best segmentation of text."
// if not text: return []
// candidates = ([first]+segment(rem) for first,rem in splits(text))
// return max(candidates, key=Pwords)

// weirdly bugged rn, too tired to fix so leave for later
function segment(text) {
  if (text.length == 0) return [];
  let candidates = splits(text).map(([first, rem]) =>
    [first].concat(segment(rem))
  );
  console.log("segmenting", text);
  console.log(`candidates=${candidates}`);
  return candidates.reduce(
    (best, candidate) => (Pwords(candidate) > Pwords(best) ? candidate : best),
    ""
  );
}

// segment = cache(segment);

function splits(text, L = 20) {
  // L is the maximum length of the first word
  // Return a list of all possible (first, rem) pairs, len(first)<=L.
  // translation of:
  // return [(text[:i+1], text[i+1:]) for i in range(min(len(text), L))]
  return Array.from({ length: Math.min(text.length, L) }, (_, i) => [
    text.slice(0, i + 1),
    text.slice(i + 1),
  ]);
}

function Pwords(words) {
  // The Naive Bayes probability of a sequence of words.
  // takes a sequence of words
  if (typeof words === "string") return 0;
  console.log(
    words,
    words.map(Pw).reduce((a, b) => a + b, 0)
  );
  return words.map(Pw).reduce((a, b) => a + b, 0);
}

function Pw(text) {
  // get unigram log probability of word
  return logwordfreqs[text] ?? -100;
}

function addSpaces() {
  var textarea = document.getElementById("input");
  // use norvig's approach from https://norvig.com/ngrams/ch14.pdf
  // "viterbi algorithm"
  // he gives 2 versions, I'm implementing the first one as it is simpler
  // with only a small cost to accuracy

  // doesn't work yet so don't do anything
  // textarea.value = segment(textarea.value);
}

document.getElementById("to-lower").addEventListener("click", toLower);
document.getElementById("to-upper").addEventListener("click", toUpper);
document
  .getElementById("remove-non-alpha")
  .addEventListener("click", removeNonAlpha);
document
  .getElementById("copy-to-clipboard")
  .addEventListener("click", copyToClipboard);
