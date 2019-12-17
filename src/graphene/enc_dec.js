var graphene = require("graphene-pk11");
var Module = graphene.Module;

var lib = "/usr/local/lib/softhsm/libsofthsm2.so";

var mod = Module.load(lib, "SoftHSM");
mod.initialize();

var slot = mod.getSlots(0);
if (slot.flags & graphene.SlotFlag.TOKEN_PRESENT) {
    var session = slot.open();
    session.login("12345678");

    // generate AES key
    var key = session.generateKey(graphene.KeyGenMechanism.AES, {
        "class": graphene.ObjectClass.SECRET_KEY,
        "token": false,
        "valueLen": 256 / 8,
        "keyType": graphene.KeyType.AES,
        "label": "My AES secret key",
        "encrypt": true,
        "decrypt": true
    });
    
    // enc algorithm
    var alg = {
        name: "AES_CBC_PAD",
        params: Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6]) // IV
    };
    var MESSAGE = "Encrypted message";
    
    // encrypting
    var cipher = session.createCipher(alg, key);
    var enc = cipher.update(MESSAGE);
    enc = Buffer.concat([enc, cipher.final()]);
    console.log("Enc:", enc.toString("hex"));           // Enc: eb21e15b896f728a4...
    
    // decrypting
    var decipher = session.createDecipher(alg, key);
    var dec = decipher.update(enc);
    var msg = Buffer.concat([dec, decipher.final()]).toString();
    console.log("Message:", msg.toString());            // Message: Encrypted message
    
    session.logout();
    session.close();
}
else {
    console.error("Slot is not initialized");
}

mod.finalize();