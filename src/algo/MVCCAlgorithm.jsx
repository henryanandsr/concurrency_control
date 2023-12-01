import Parser from "./parser"

class MVCCAlgorithm {
    constructor(input) {
        this.sequence = Parser(input);
        this.versionArray = new Map();
        this.count = 0;
        this.rollback = [];
        this.readHistory = new Map();
        this.timestamp = new Map();
        this.result = [];
    }
    read(action, transaction, resource) {
        this.count += 1;
        const version = this.versionArray.get(resource);
        if (!version) {
            // buat versi baru dengan key = resource, value = {readTimestamp : ..., writeTimestamp : ...}
            const ts = this.timestamp.get(transaction);
            this.versionArray.set(resource, [{ version: 0, readTimestamp: ts, writeTimestamp: 0 }]);
            console.log("Transaction " + transaction + " read " + resource + " at version 0" + " Timestamp : " + this.versionArray.get(resource)[0].readTimestamp + ", " +  this.versionArray.get(resource)[0].writeTimestamp);
            this.result.push("Transaction " + transaction + " read " + resource + " at version 0" + " Timestamp : " + this.versionArray.get(resource)[0].readTimestamp + ", " +  this.versionArray.get(resource)[0].writeTimestamp);
            return true;
        } else {
            // get latest version number for resource
            let temp = -1;
            let idx = -1;
            for (let i = 0; i < version.length; i++) {
                if (version[i].version > temp) {
                    temp = version[i].version;
                    idx = i;
                }
            }
            // get latest version
            const latestVersion = version[idx];

            // check Qk < Ts
            const ts = this.timestamp.get(transaction);
            if (latestVersion.readTimestamp < ts) {
                // update readTimestamp
                // get timestamp for transaction 
                this.versionArray.get(resource)[idx].readTimestamp = ts;
                // add key = version number, value = array of transaction to readHistory
                const readHistory = this.readHistory.get(latestVersion.version);
                if (!readHistory) {
                    this.readHistory.set(latestVersion.version, [ts]);
                } else {
                    this.readHistory.get(latestVersion.version).push(ts);
                }
                console.log("Transaction " + transaction + " read " + resource + " at version " + latestVersion.version + " Timestamp : " + this.versionArray.get(resource)[idx].readTimestamp + ", " +  this.versionArray.get(resource)[idx].writeTimestamp);
                this.result.push("Transaction " + transaction + " read " + resource + " at version " + latestVersion.version + " Timestamp : " + this.versionArray.get(resource)[idx].readTimestamp + ", " +  this.versionArray.get(resource)[idx].writeTimestamp);
                return true;
            } else {
                // read without update
                const readHistory = this.readHistory.get(latestVersion.version);
                if (!readHistory) {
                    this.readHistory.set(latestVersion.version, [ts]);
                } else {
                    this.readHistory.get(latestVersion.version).push(ts);
                }
                console.log("Transaction " + transaction + " read " + resource + " at version " + latestVersion.version + " Timestamp : " + this.versionArray.get(resource)[idx].readTimestamp + ", " +  this.versionArray.get(resource)[idx].writeTimestamp);
                this.result.push("Transaction " + transaction + " read " + resource + " at version " + latestVersion.version + " Timestamp : " + this.versionArray.get(resource)[idx].readTimestamp + ", " +  this.versionArray.get(resource)[idx].writeTimestamp);
                return true;
            }
        }
    }
    write(action, transaction, resource) {
        const version = this.versionArray.get(resource);
        if (!version) {
            // buat versi baru dengan key = resource, value = {readTimestamp : ..., writeTimestamp : ...}
            const ts = this.timestamp.get(transaction);
            this.versionArray.set(resource, [{ version: 0, readTimestamp: ts, writeTimestamp: ts }]);
            this.count += 1;
            console.log("Transaction " + transaction + " write " + resource + " at version 0" + " Timestamp : " + this.versionArray.get(resource)[0].readTimestamp + ", " +  this.versionArray.get(resource)[0].writeTimestamp);
            this.result.push("Transaction " + transaction + " write " + resource + " at version 0" + " Timestamp : " + this.versionArray.get(resource)[0].readTimestamp + ", " +  this.versionArray.get(resource)[0].writeTimestamp);
            return true;
        } else {
            // get latest version number for resource
            let temp = -1;
            let idx = -1;
            for (let i = 0; i < version.length; i++) {
                if (version[i].version > temp) {
                    temp = version[i].version;
                    idx = i;
                }
            }
            // get latest version
            const latestVersion = version[idx];

            // check R-TS Qk > Ts
            const ts = this.timestamp.get(transaction);
            if (latestVersion.readTimestamp > ts) {
                // abort
                // add transaction to rollback
                console.log("Transaction " + transaction + " Rollback. Assigned new timestamp : " + this.count);
                this.result.push("Transaction " + transaction + " Rollback. Assigned new timestamp : " + this.count);
                this.timestamp.set(transaction, this.count);
                this.count +=1;
                this.rollback.push(transaction);
                // search all transaction that have read version == transaction
                const readHistory = this.readHistory.get(transaction);
                if (readHistory) {
                    for (let i = 0; i < readHistory.length; i++) {
                        this.rollback.push(readHistory[i]);
                        this.timestamp.set(readHistory[i], this.count);
                        console.log("Transaction " + readHistory[i] + " Rollback. Assigned new timestamp : " + this.count)
                        this.result.push("Transaction " + readHistory[i] + " Rollback. Assigned new timestamp : " + this.count)
                        this.count +=1;
                    }
                }
                return false;
            } else if (latestVersion.writeTimestamp === transaction) {
                // update writeTimestamp
                this.versionArray.get(resource)[idx].writeTimestamp = ts;
                console.log("Transaction " + transaction + " write " + resource + " at version " + latestVersion.version + " Timestamp : " + this.versionArray.get(resource)[idx].readTimestamp + ", " +  this.versionArray.get(resource)[idx].writeTimestamp);
                this.result.push("Transaction " + transaction + " write " + resource + " at version " + latestVersion.version + " Timestamp : " + this.versionArray.get(resource)[idx].readTimestamp + ", " +  this.versionArray.get(resource)[idx].writeTimestamp);
                this.count += 1;
                return true;
            } else {
                // create new version
                const newVersion = {
                    version: ts,
                    readTimestamp: ts,
                    writeTimestamp: ts
                }
                this.versionArray.get(resource).push(newVersion);
                this.count += 1;
                console.log("Transaction " + transaction + " write " + resource + " at version " + newVersion.version + " Timestamp : " + newVersion.readTimestamp + ", " +  newVersion.writeTimestamp);
                this.result.push("Transaction " + transaction + " write " + resource + " at version " + newVersion.version + " Timestamp : " + newVersion.readTimestamp + ", " +  newVersion.writeTimestamp)
                return true;
            }
        }
    }
    execute() {
        for (let i = 0 ; i < this.sequence.length; i++) {
            const { types, action, transaction, resource } = this.sequence[i];
            if (!this.timestamp.get(transaction)) {
                this.timestamp.set(transaction, transaction);
            }
        }
        let i = 0;
        while (i < this.sequence.length) {
            const { action, transaction, resource } = this.sequence[i];
            // check if transaction is rollback
            if (this.rollback.includes(transaction)) {
                i++;
                continue;
            }
            if (action === "R") {
                const res = this.read(action, transaction, resource);
            } else if (action === "W") {
                const res = this.write(action, transaction, resource);
            }
            i++;
        }
        // filter sequence to get transaction that rollback
        const rollbackTransaction = this.sequence.filter((item) => {
            return this.rollback.includes(item.transaction);
        });

        if (this.rollback.length > 0) {
            this.sequence = rollbackTransaction;
            this.rollback = [];
            this.readHistory = new Map();
            this.execute();
        }
    }
}
export default MVCCAlgorithm;