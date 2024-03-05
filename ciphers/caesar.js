function encryptText(text, shift) {
    text = text.toLowerCase();
    let result = "";
    console.log(typeof shift);
    for (let i = 0; i < text.length; i++) {
        let c = text.charCodeAt(i);
        console.log(c, c - 97, (c - 97) % 26);
        if (c >= 97 && c <= 122) {
            result += String.fromCharCode(((c - 97 + shift) % 26) + 97);
        } else {
            result += text.charAt(i);
        }
    }
    document.getElementById("result").innerHTML = result;
}

function decryptText(text, shift) {
    text = text.toLowerCase();
    let result = "";
    for (let i = 0; i < text.length; i++) {
        let c = text.charCodeAt(i);
        if (c >= 97 && c <= 122) {
            result += String.fromCharCode(((c - 97 - shift + 26) % 26) + 97);
        } else {
            result += text.charAt(i);
        }
    }
    document.getElementById("result").innerHTML = result;
}
