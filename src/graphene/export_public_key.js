var graphene = require("graphene-pk11");
var Module = graphene.Module;

var lib = "/usr/local/lib/softhsm/libsofthsm2.so";

var mod = Module.load(lib, "SoftHSM");
mod.initialize();

var slot = mod.getSlots(0);
if (slot.flags & graphene.SlotFlag.TOKEN_PRESENT) {
    var session = slot.open();
    session.login("12345678");
    
    // generate RSA key pair
    var keys = session.generateKeyPair(graphene.KeyGenMechanism.RSA, {
        keyType: graphene.KeyType.RSA,
        modulusBits: 1024,
        publicExponent: Buffer.from([3]),
        token: false,
        verify: true,
        encrypt: true,
        wrap: true
    }, {
        keyType: graphene.KeyType.RSA,
        token: false,
        sign: true,
        decrypt: true,
        unwrap: true
    });
    
    // get public key attributes
    var pubKey = keys.publicKey.getAttribute({
        modulus: null,
        publicExponent: null
    });
    
    // convert values to base64
    pubKey.modulus = pubKey.modulus.toString("base64");
    pubKey.publicExponent = pubKey.publicExponent.toString("base64");
    
    
    console.log(JSON.stringify(pubKey, null, 4));
    
    session.logout();
    session.close();
}
else {
    console.error("Slot is not initialized");
}

mod.finalize();