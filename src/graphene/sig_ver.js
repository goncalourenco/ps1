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
    
    // sign content
    var sign = session.createSign("SHA1_RSA_PKCS", keys.privateKey);
    sign.update("simple text 1");
    sign.update("simple text 2");
    var signature = sign.final();
    console.log("Signature RSA-SHA1:", signature.toString("hex")); // Signature RSA-SHA1: 6102a66dc0d97fadb5...
    
    // verify content
    var verify = session.createVerify("SHA1_RSA_PKCS", keys.publicKey);
    verify.update("simple text 1");
    verify.update("simple text 2");
    var verify_result = verify.final(signature);
    console.log("Signature RSA-SHA1 verify:", verify_result);      // Signature RSA-SHA1 verify: true
    
    session.logout();
    session.close();
}
else {
    console.error("Slot is not initialized");
}

mod.finalize();