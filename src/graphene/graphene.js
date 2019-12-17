var graphene = require("graphene-pk11");
var Module = graphene.Module;
var lib = "/usr/local/lib/softhsm/libsofthsm2.so";
var mod = Module.load(lib, "SoftHSM");
mod.initialize();
// get slots
var slots = mod.getSlots(true);
if (slots.length > 0) {
    for (var i = 0; i < slots.length; i++) {
        var slot = slots.items(i);
        console.log("Slot #" + slot.handle);
        console.log("\tDescription:", slot.slotDescription);
        console.log("\tSerial:", slot.getToken().serialNumber);
        console.log("\tPassword(min/max): %d/%d", slot.getToken().minPinLen, slot.getToken().maxPinLen);
        console.log("\tIs hardware:", !!(slot.flags & graphene.SlotFlag.HW_SLOT));
        console.log("\tIs removable:", !!(slot.flags & graphene.SlotFlag.REMOVABLE_DEVICE));
        console.log("\tIs initialized:", !!(slot.flags & graphene.SlotFlag.TOKEN_PRESENT));
        console.log("\n\nMechanisms:");
        console.log("Name                       h/s/v/e/d/w/u");
        console.log("========================================");
        function b(v) {
            return v ? "+" : "-";
        }

        function s(v) {
            v = v.toString();
            for (var i_1 = v.length; i_1 < 27; i_1++) {
                v += " ";
            }
            return v;
        }

        var mechs = slot.getMechanisms();
        for (var j = 0; j < mechs.length; j++) {
            var mech = mechs.items(j);
            console.log(s(mech.name) +
                b(mech.flags & graphene.MechanismFlag.DIGEST) + "/" +
                b(mech.flags & graphene.MechanismFlag.SIGN) + "/" +
                b(mech.flags & graphene.MechanismFlag.VERIFY) + "/" +
                b(mech.flags & graphene.MechanismFlag.ENCRYPT) + "/" +
                b(mech.flags & graphene.MechanismFlag.DECRYPT) + "/" +
                b(mech.flags & graphene.MechanismFlag.WRAP) + "/" +
                b(mech.flags & graphene.MechanismFlag.UNWRAP));
        }
    }
}
mod.finalize();