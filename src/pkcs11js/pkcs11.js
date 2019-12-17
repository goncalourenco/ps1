var pkcs11js = require("pkcs11js");

var pkcs11 = new pkcs11js.PKCS11();
pkcs11.load("/usr/local/lib/softhsm/libsofthsm2.so");

pkcs11.C_Initialize();

try {
    // Getting info about PKCS11 Module
    var module_info = pkcs11.C_GetInfo();

    // Getting list of slots
    var slots = pkcs11.C_GetSlotList(true);
    var slot = slots[0];

    // Getting info about slot
    var slot_info = pkcs11.C_GetSlotInfo(slot);
    // Getting info about token
    var token_info = pkcs11.C_GetTokenInfo(slot);

    // Getting info about Mechanism
    var mechs = pkcs11.C_GetMechanismList(slot);
    var mech_info = pkcs11.C_GetMechanismInfo(slot, mechs[0]);

    var session = pkcs11.C_OpenSession(slot, pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);

    // Getting info about Session
    var info = pkcs11.C_GetSessionInfo(session);
    pkcs11.C_Login(session, 1, "12345678");

    var iv_param = pkcs11.C_GenerateRandom(new Buffer(12));
    pkcs11.C_DeriveKey(
        session,
        {
            mechanism: pkcs11js.CKM_AES_GCM,
            parameter: {
                iv: iv_param,
                
                
            }
        }
    );

    /**
    * Your app code here
    */
    
    pkcs11.C_Logout(session);
    pkcs11.C_CloseSession(session);
    

catch(e){
    console.error(e);
}
finally {
    pkcs11.C_Finalize();
}