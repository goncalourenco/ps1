var graphene = require("graphene-pk11");
var Module = graphene.Module;

var lib = "/usr/local/lib/softhsm/libsofthsm2.so";

var mod = Module.load(lib, "SoftHSM");
mod.initialize();

var slot = mod.getSlots(0);
if (slot.flags & graphene.SlotFlag.TOKEN_PRESENT) {
    var session = slot.open();
    session.login("12345678");
    
    var k = session.generateKey(graphene.KeyGenMechanism.AES, {
        "class": graphene.ObjectClass.SECRET_KEY,
        "token": false,
        "valueLen": 256 / 8,
        "keyType": graphene.KeyType.AES,
        "label": "My AES secret key",
        "private": true
    });
    
    console.log("Key.handle:", k.handle);                 // Key.handle: 2
    console.log("Key.type:", graphene.KeyType[k.type]);   // Key.type: AES
    console.log(Object.keys(k.handle));

    session.logout();
    session.close();
}
else {
    console.error("Slot is not initialized");
}

mod.finalize();