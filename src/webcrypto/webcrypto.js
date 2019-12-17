const { Crypto } = require("node-webcrypto-p11");
const config = {
    library: "/usr/local/lib/softhsm/libsofthsm2.so",
    name: "SoftHSM v2.0",
    slot: 0,
    readWrite: true,
    pin: "12345678"
};

const crypto = new Crypto(config);

const keys = await crypto.subtle.generateKey({name: "ECDSA", namedCurve: "P-256"}, false, ["sign", "verify"]);
// set private key to storage
const privateKeyID = await crypto.keyStorage.setItem(keys.privateKey);
// set public key to storage
const publicKeyID = await crypto.keyStorage.setItem(keys.publicKey);
// get list of keys
const indexes = await crypto.keyStorage.keys();
console.log(indexes); // ['private-3239...', 'public-3239...']
// get key by id
const privateKey = await crypto.keyStorage.getItem("private-3239...");
// signing data
const signature = await crypto.subtle.sign({name: "ECDSA", hash: "SHA-256"}, key, Buffer.from("Message here"));
console.log("Signature:", Buffer.from(signature).toString("hex"));