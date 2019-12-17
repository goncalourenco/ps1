var graphene = require("graphene-pk11");
var Module = graphene.Module;

var lib = "/usr/local/lib/softhsm/libsofthsm2.so";

var mod = Module.load(lib, "SoftHSM");
mod.initialize();

var slot = mod.getSlots(0);
if (slot.flags & graphene.SlotFlag.TOKEN_PRESENT) {
    var session = slot.open();
    session.login("12345678");

    // generate EC key
    var keys = session.generateKeyPair(graphene.KeyGenMechanism.ECDSA, {
        keyType: graphene.KeyType.ECDSA,
        token: false,
        derive: true,
        paramsECDSA: graphene.NamedCurve.getByName("secp192r1").value
    }, {
        keyType: graphene.KeyType.ECDSA,
        token: false,
        derive: true
    });
    
    // derive algorithm
    var alg = {
        name: "ECDH1_DERIVE",
        params: new graphene.EcdhParams(
            graphene.EcKdf.SHA256,
            null,
            keys.publicKey.getAttribute({pointEC: null}).pointEC)
        };
    
    // Template for derived key
    var template = {
        "class": graphene.ObjectClass.SECRET_KEY,
        "token": false,
        "keyType": graphene.KeyType.AES,
        "valueLen": 256 / 8,
        "encrypt": true,
        "decrypt": true
    }
 
   const getMethods = (obj) => {
    let properties = new Set()
    let currentObj = obj
    do {
      Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
    } while ((currentObj = Object.getPrototypeOf(currentObj)))
    return [...properties.keys()].filter(item => typeof obj[item] === 'function')
  }
    console.log(getMethods(session));

    var dKey = session.deriveKey(alg, keys.privateKey, template)
    console.log("Derived key handle:", dKey.handle);
    
    session.logout();
    session.close();
}
else {
    console.error("Slot is not initialized");
}

mod.finalize();