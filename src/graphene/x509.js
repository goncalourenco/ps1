const graphene = require("graphene-pk11");

const mod = graphene.Module.load("/usr/local/lib/softhsm/libsofthsm2.so", "SoftHSM");

mod.initialize();

try {
    const slot = mod.getSlots(0);
    const session = slot.open(2 | 4)
    session.login("12345678");

    const template = {
        class: graphene.ObjectClass.CERTIFICATE,
        certType: graphene.CertificateType.X_509,
        private: false,
        token: false,
        id: Buffer.from([1, 2, 3, 4, 5]), // Should be the same as Private/Public key has
        label: "My certificate",
        subject: Buffer.from("3034310B300906035504...", "hex"),
        value: Buffer.from("308203A830820290A003...", "hex"),
    };

    const objCert = session.create(template).toType();

    console.log("Certificate: created\n");
    console.log("Certificate info:\n===========================");
    console.log("Handle:", objCert.handle.toString("hex"));
    console.log("ID:", objCert.id.toString("hex"));
    console.log("Label:", objCert.label);
    console.log("category:", graphene.CertificateCategory[objCert.category]);
    console.log("Subject:", objCert.subject.toString("hex"));
    console.log("Value:", objCert.value.toString("hex"));
} catch (err) {
    console.error(err);
}

mod.finalize();