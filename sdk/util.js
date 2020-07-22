// util.js
// Functions related to save and get data 


/**
 * Object Store (table) name of IndexedDB.
 * Funding private key
 */
const kTbFundingPrivKey = 'tb_funding_priv_key';

//
const kCounterparties = 'counterparties';

//
const kAddress = 'address';

//
const kMnemonic = 'mnemonic';

//
const kChannelID = 'channel_id';

//
const kChannelAddress = 'channel_address';

//
const kTempHash = 'temp_hash';

//
const kFundingBtc = 'funding_btc';

//
const kRoutingPacket = 'routing_packet';

//
const kCltvExpiry = 'cltv_expiry';

//
const kHtlcH = 'htlc_h';

//
const kHtlcR = 'htlc_r';

/**
 * Save RSMC tx temporary private key to local storage
 */
const kRsmcTempPrivKey = 'rsmc_temp_priv_key';

/**
 * Save HTLC tx temporary private key to local storage
 */
const kHtlcTempPrivKey = 'htlc_temp_priv_key';

/**
 * Save HTLC htnx tx temporary private key to local storage
 */
const kHtlcHtnxTempPrivKey = 'htlc_htnx_temp_priv_key';

/**
 * Object of IndexedDB.
 */
var db;

/**
 * Object Store (table) name of IndexedDB.
 * Global messages
 */
const kTbGlobalMsg = 'tb_global_msg';


/**
 * Object Store (table) name of IndexedDB.
 * temp private key
 */
const kTbTempPrivKey = 'tb_temp_priv_key';


/**
 *  List of Counterparties who have interacted
 *  @param myUserID The user id of logged in
 *  @param toNodeID The node id of the counterparty.
 *  @param toUserID The user id of the counterparty.
 */
function saveCounterparties(myUserID, toNodeID, toUserID) {

    let list = JSON.parse(localStorage.getItem(kCounterparties));

    // If has data.
    if (list) {
        // console.info('HAS DATA');
        for (let i = 0; i < list.result.length; i++) {
            // same userID
            if (myUserID === list.result[i].userID) {
                for (let i2 = 0; i2 < list.result[i].data.length; i2++) {
                    // if UserPeerID is same, then NodePeerID is updated.
                    if (list.result[i].data[i2].userID === toUserID) {
                        list.result[i].data[i2].nodeID = toNodeID;
                        localStorage.setItem(kCounterparties, JSON.stringify(list));
                        return;
                    }
                }

                // Add a new data to the userID
                let new_data = {
                    userID: toUserID,
                    nodeID: toNodeID
                }
                list.result[i].data.push(new_data);
                localStorage.setItem(kCounterparties, JSON.stringify(list));
                return;
            }
        }

        // A new User ID.
        let new_data = {
            userID: myUserID,
            data: [{
                userID: toUserID,
                nodeID: toNodeID
            }]
        }
        list.result.push(new_data);
        localStorage.setItem(kCounterparties, JSON.stringify(list));

    } else {
        // console.info('FIRST DATA');
        let data = {
            result: [{
                userID: myUserID,
                data: [{
                    userID: toUserID,
                    nodeID: toNodeID
                }]
            }]
        }
        localStorage.setItem(kCounterparties, JSON.stringify(data));
    }
}

/**
 * Get Lastest Counterparty
 * @param myUserID The user id of logged in
 */
function getCounterparty(myUserID) {

    let data = JSON.parse(localStorage.getItem(kCounterparties));

    // If has data.
    if (data) {
        // console.info('HAS DATA');
        for (let i = 0; i < data.result.length; i++) {
            if (myUserID === data.result[i].userID) {
                let lastIndex = data.result[i].data.length - 1;
                return data.result[i].data[lastIndex];
            }
        }
        return '';
    } else {
        return '';
    }
}

//
function getFundingPrivKeyFromPubKey(myUserID, pubkey) {

    let addr = JSON.parse(localStorage.getItem(kAddress));

    // If has data.
    if (addr) {
        // console.info('HAS DATA');
        for (let i = 0; i < addr.result.length; i++) {
            if (myUserID === addr.result[i].userID) {
                for (let j = 0; j < addr.result[i].data.length; j++) {
                    if (pubkey === addr.result[i].data[j].pubkey) {
                        return addr.result[i].data[j].wif;
                    }
                }
            }
        }
        return '';
    } else {
        return '';
    }
}

/**
 * Add a record to table Funding private key or Last temp private key
 * @param user_id
 * @param channel_id
 * @param privkey
 * @param tbName: Funding private key or Last temp private key
 */
function addDataInTable(user_id, channel_id, privkey, tbName) {

    let request = db.transaction([tbName], 'readwrite')
        .objectStore(tbName)
        .add({ user_id: user_id, channel_id: channel_id, privkey: privkey });
  
    request.onsuccess = function (e) {
        console.log('Data write success.');
    };
  
    request.onerror = function (e) {
        console.log('Data write false.');
    }
}

/**
 * Save channelID to local storage
 * @param channelID
 */
function saveChannelID(channelID) {
    localStorage.setItem(kChannelID, channelID);
}

/**
 * Get channelID from local storage
 */
function getChannelID() {
    return localStorage.getItem(kChannelID);
}

/**
 * Address generated from mnemonic words save to local storage.
 * @param myUserID 
 * @param value 
 */
function saveAddress(myUserID, value) {

    let resp = JSON.parse(localStorage.getItem(kAddress));

    // If has data.
    if (resp) {
        // console.info('HAS DATA');
        for (let i = 0; i < resp.result.length; i++) {
            if (myUserID === resp.result[i].userID) {
                // Add new dato to 
                let new_data = {
                    address: value.result.address,
                    index:   value.result.index,
                    pubkey:  value.result.pubkey,
                    wif:     value.result.wif
                }
                resp.result[i].data.push(new_data);
                localStorage.setItem(kAddress, JSON.stringify(resp));
                return;
            }
        }

        // A new User ID.
        let new_data = {
            userID: myUserID,
            data: [{
                address: value.result.address,
                index:   value.result.index,
                pubkey:  value.result.pubkey,
                wif:     value.result.wif
            }]
        }
        resp.result.push(new_data);
        localStorage.setItem(kAddress, JSON.stringify(resp));

    } else {
        // console.info('FIRST DATA');
        let data = {
            result: [{
                userID: myUserID,
                data: [{
                    address: value.result.address,
                    index:   value.result.index,
                    pubkey:  value.result.pubkey,
                    wif:     value.result.wif
                }]
            }]
        }
        localStorage.setItem(kAddress, JSON.stringify(data));
    }
}

/**
 * Get addresses by mnemonic words created from local storage
 */
function getAddress() {
    return JSON.parse(localStorage.getItem(kAddress));
}

/**
 * save Channel ddress to localStorage
 * @param address
 */
function saveChannelAddress(address) {
    localStorage.setItem(kChannelAddress, address);
}

/**
 * get Channel ddress from localStorage
 */
function getChannelAddress() {
    return localStorage.getItem(kChannelAddress);
}

/**
 * save temp hash from:
 * @param hex
 * 1) fundingBTC -102109 return
 * 2) BTCFundingCreated type ( -100340 ) return
 * 3) FundingAsset type ( -102120 ) return
 * 4) RSMCCTxCreated type ( -100351 ) return
 * 5) HTLCCreated type ( -100040 ) return
 */
function saveTempHash(hex) {
    localStorage.setItem(kTempHash, hex);
}

/**
 * get temp hash from:
 * 1) fundingBTC -102109 return
 * 2) BTCFundingCreated type ( -100340 ) return
 * 3) FundingAsset type ( -102120 ) return
 * 4) RSMCCTxCreated type ( -100351 ) return
 * 5) HTLCCreated type ( -100040 ) return
 */
function getTempHash() {
    return localStorage.getItem(kTempHash);
}

// 
function saveFundingBtcData(myUserID, info) {

    let resp = JSON.parse(localStorage.getItem(kFundingBtc));

    // If has data.
    if (resp) {
        // console.info('HAS DATA');
        for (let i = 0; i < resp.result.length; i++) {
            if (myUserID === resp.result[i].userID) {
                // Remove
                resp.result.splice(i, 1);
            }
        }

        // A new User ID.
        let new_data = {
            userID:                   myUserID,
            from_address:             info.from_address,
            from_address_private_key: info.from_address_private_key,
            to_address:               info.to_address,
            amount:                   info.amount,
            miner_fee:                info.miner_fee
        }
        resp.result.push(new_data);
        localStorage.setItem(kFundingBtc, JSON.stringify(resp));

    } else {
        // console.info('FIRST DATA');
        let data = {
            result: [{
                userID:                   myUserID,
                from_address:             info.from_address,
                from_address_private_key: info.from_address_private_key,
                to_address:               info.to_address,
                amount:                   info.amount,
                miner_fee:                info.miner_fee
            }]
        }
        localStorage.setItem(kFundingBtc, JSON.stringify(data));
    }
}

//
function getFundingBtcData(myUserID) {

    let resp = JSON.parse(localStorage.getItem(kFundingBtc));

    // If has data.
    if (resp) {
        for (let i = 0; i < resp.result.length; i++) {
            if (myUserID === resp.result[i].userID) {
                return resp.result[i];
            }
        }
        return '';
    } else {
        return '';
    }
}

/**
 * Save Htlc H
 * @param value
 */
function saveHtlcH(value) {
    localStorage.setItem(kHtlcH, value);
}

/**
 * Get Htlc H
 */
function getHtlcH() {
    return localStorage.getItem(kHtlcH);
}

/**
 * Save Routing Packet
 * @param value
 */
function saveRoutingPacket(value) {
    localStorage.setItem(kRoutingPacket, value);
}

/**
 * Get Routing Packet
 */
function getRoutingPacket() {
    return localStorage.getItem(kRoutingPacket);
}

/**
 * Save Cltv Expiry
 * @param value
 */
function saveCltvExpiry(value) {
    localStorage.setItem(kCltvExpiry, value);
}

/**
 * Get Cltv Expiry
 */
function getCltvExpiry() {
    return localStorage.getItem(kCltvExpiry);
}


/**
 * Save temporary private key to local storage
 * @param myUserID
 * @param saveKey
 * @param channelID
 * @param privkey
 */
function saveTempPrivKey(myUserID, saveKey, channelID, privkey) {
    
    let resp = JSON.parse(localStorage.getItem(saveKey));

    // If has data.
    if (resp) {
        // console.info('HAS DATA');
        for (let i = 0; i < resp.result.length; i++) {
            if (myUserID === resp.result[i].userID) {
                for (let j = 0; j < resp.result[i].data.length; j++) {
                    if (channelID === resp.result[i].data[j].channelID) {
                        // update privkey 
                        resp.result[i].data[j].privkey = privkey;
                        localStorage.setItem(saveKey, JSON.stringify(resp));
                        return;
                    }
                }

                // A new channel id
                let new_data = {
                    channelID: channelID,
                    privkey:   privkey
                }
                resp.result[i].data.push(new_data);
                localStorage.setItem(saveKey, JSON.stringify(resp));
                return;
            }
        }

        // A new User ID.
        let new_data = {
            userID:  myUserID,
            data: [{
                channelID: channelID,
                privkey:   privkey
            }]
        }
        resp.result.push(new_data);
        localStorage.setItem(saveKey, JSON.stringify(resp));

    } else {
        // console.info('FIRST DATA');
        let data = {
            result: [{
                userID:  myUserID,
                data: [{
                    channelID: channelID,
                    privkey:   privkey
                }]
            }]
        }
        localStorage.setItem(saveKey, JSON.stringify(data));
    }
}

/**
 * Get temporary private key from local storage
 * @param myUserID
 * @param saveKey
 * @param channelID
 */
function getTempPrivKey(myUserID, saveKey, channelID) {
    
    let resp = JSON.parse(localStorage.getItem(saveKey));

    // If has data.
    if (resp) {
        // console.info('HAS DATA');
        for (let i = 0; i < resp.result.length; i++) {
            if (myUserID === resp.result[i].userID) {
                for (let j = 0; j < resp.result[i].data.length; j++) {
                    if (channelID === resp.result[i].data[j].channelID) {
                        return resp.result[i].data[j].privkey;
                    }
                }
            }
        }
        return '';
    } else {
        return '';
    }
}

/**
 * mnemonic words generated with signUp api save to local storage.
 * @param value mnemonic words
 */
function saveMnemonic(value) {

    let mnemonic = JSON.parse(sessionStorage.getItem(kMnemonic));
    // let mnemonic = JSON.parse(localStorage.getItem(kMnemonic));

    // If has data.
    if (mnemonic) {
        // console.info('HAS DATA');
        let new_data = {
            mnemonic: value,
        }
        mnemonic.result.push(new_data);
        sessionStorage.setItem(kMnemonic, JSON.stringify(mnemonic));
        // localStorage.setItem(kMnemonic, JSON.stringify(mnemonic));

    } else {
        // console.info('FIRST DATA');
        let data = {
            result: [{
                mnemonic: value
            }]
        }
        sessionStorage.setItem(kMnemonic, JSON.stringify(data));
        // localStorage.setItem(kMnemonic, JSON.stringify(data));
    }
}