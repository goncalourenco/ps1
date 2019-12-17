var graphene = require("graphene-pk11");
var Module = graphene.Module;

var lib = "/usr/local/lib/softhsm/libsofthsm2.so";

var mod = Module.load(lib, "SoftHSM");
mod.initialize();

var slot = mod.getSlots(0);
if (slot.flags & graphene.SlotFlag.TOKEN_PRESENT) {
    var session = slot.open();
    var digest = session.createDigest("sha1");
    digest.update("simple text 1");
    //digest.update("simple text 2");
    var hash = digest.final();
    console.log("Hash SHA1:", hash.toString("hex")); // Hash SHA1: e1dc1e52e9779cd69679b3e0af87d2e288190d34 
    session.close();
}
else {
    console.error("Slot is not initialized");
}

mod.finalize();