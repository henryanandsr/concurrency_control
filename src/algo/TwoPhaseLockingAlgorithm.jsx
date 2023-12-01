import Parser from "./parser";

class TwoPhaseLockingAlgorithm {
    constructor(input) {
        this.sequence = Parser(input);
        console.log("Sequence: ")
        console.log(this.sequence);
        this.aborted = [];
        this.abortedId = [];
        this.queue = [];
        this.queueId = [];
        this.resourceMap = new Map();
        this.transactionLocks = new Map();
        this.resultTable = [];
    }

    applyLock(action, transaction, resource) {
        // Check transaksi sudah ada di transactionLocks atau belum
        if (!this.transactionLocks.has(transaction)) {
            this.transactionLocks.set(transaction, new Set());
        }
        if (!this.resourceMap.has(resource)) {
            this.resourceMap.set(resource, { sharedLock: new Set(), exclusiveLock: null });
        }
        // Ambil set dari transactionLocks
        const transactionLockSet = this.transactionLocks.get(transaction);

        // if (transactionLockSet.has(resource)) {
            // ambil resourceLock dari resourceMap
        const resourceLock = this.resourceMap.get(resource);
        
        // Check apakah transaction sudah memiliki exclusive lock
        if (resourceLock.exclusiveLock === transaction) {
            return true;
        }

        if (action === 'R' && resourceLock.exclusiveLock !== null) {
            // kasus 1: transaction ingin membaca resource yang sedang di lock oleh transaction lain
            const olderTransaction = resourceLock.exclusiveLock;
            
            // cari transaksi apakah lebih muda atau lebih tua di index sequence
            const currentTransaction = this.sequence.findIndex((item) => item.transaction === transaction);
            console.log("Current Transaction: " + currentTransaction);
            const indexHolderTransaction = this.sequence.findIndex((item) => item.transaction === olderTransaction);
            console.log("Index Holder Transaction: " + indexHolderTransaction);
            if (currentTransaction > indexHolderTransaction) {
                // add to queue
                // for (let i=currentTransaction; i<this.sequence.length; i++) {
                //     if (this.sequence[i].transaction === transaction) {
                //         this.queue.push(this.sequence[i]);
                //     }
                // }
                this.queueId.push(transaction);
                console.log("Pushing Queue Id: ", transaction);
                // remove from sequence
                this.resultTable.push({ transaction: transaction, action: 'Queue SL', resource: resource });
                // this.sequence = this.sequence.filter((item) => item.transaction !== transaction);
                return false;
            } else {
                // abort transaksi yang lebih muda (Wound-Wait)
                this.abortedId.push(olderTransaction);
                this.releaseLocks(olderTransaction);
                console.log("olderTransaction: " + olderTransaction)
                // this.resultTable.push({ transaction: transaction, action: 'XL', resource: resource });
                transactionLockSet.add(resource);
                resourceLock.sharedLock.add(transaction);
                // this.resultTable.push({ transaction: transaction, action: 'SL', resource: resource });
                // this.aborted.push(olderTransaction);
                // filter sequence and add it to aborted
                
                // for(let i = 0; i < this.sequence.length; i++) {
                //     if(this.sequence[i].transaction === olderTransaction) {
                //         this.aborted.push(this.sequence[i]);
                //     }
                // }
                
                this.resultTable.push({ transaction: olderTransaction, action: 'A', resource: '-' });
                this.resultTable.push({ transaction: transaction, action: 'SL', resource: resource });
                // this.sequence = this.sequence.filter((item) => item.transaction !== olderTransaction);
            }
        } else if (action === 'W' && (resourceLock.sharedLock.size > 0 || resourceLock.exclusiveLock !== null)) {
            // kasus 2: transaction ingin menulis resource yang sedang di lock oleh transaction lain
            console.log("currentTransaction: ", action, transaction, resource);
            console.log(resourceLock.sharedLock, resourceLock.exclusiveLock);
            let olderTransaction = Array.from(resourceLock.sharedLock);
            console.log("kasus 2")
            console.log("olderTransaction: " + olderTransaction)

            // cari transaksi apakah lebih muda atau lebih tua di index sequence
            const currentTransaction = this.sequence.findIndex((item) => item.transaction === transaction);
            // console.log("olderTransaction: " + olderTransaction);
            // delete transaction from olderTransaction
            const index = olderTransaction.indexOf(transaction);
            if (index > -1) {
                olderTransaction.splice(index, 1);
            }
            console.log("olderTransaction: " + olderTransaction);
            // make olderTransaction to array
            olderTransaction = Array.from(olderTransaction);
            console.log("Current Transaction: " + currentTransaction);
            console.log(this.sequence)
            let isOlderThanAll = true;
            // check if current transaction is older than older transaction
            for (let i = 0; i < olderTransaction.length; i++) {
                console.log(transaction !== parseInt(olderTransaction[i]));
                console.log(transaction, parseInt(olderTransaction[i]))
                if (transaction !== parseInt(olderTransaction[i])) {
                    console.log(parseInt(olderTransaction[i]))
                    const indexHolderTransaction = this.sequence.findIndex((item) => item.transaction === olderTransaction[i]);
                    console.log("Index Holder Transaction: " + indexHolderTransaction, olderTransaction[i]);
                    if (currentTransaction > indexHolderTransaction && indexHolderTransaction >= 0) {
                        // add to queue
                        // for (let j=currentTransaction; j<this.sequence.length; j++) {
                        //     if (this.sequence[j].transaction === transaction) {
                        //         this.queue.push(this.sequence[j]);
                        //     }
                        // }
                        let queuedSequence = this.sequence.findIndex((item) => item.transaction === transaction && item.action === action && item.resource === resource)

                        this.queueId.push(transaction);

                        this.queue.push(this.sequence[queuedSequence]);
                        console.log("Pushing Queue Current Id: ", transaction, this.sequence[queuedSequence]);
                        // remove from sequence
                        this.resultTable.push({ transaction: transaction, action: 'Queue XL', resource: resource });
                        // this.sequence = this.sequence.filter((item) => item.transaction !== transaction);
                        isOlderThanAll = false;
                        
                    } else {
                        console.log("releasing lock on ", olderTransaction[i]);
                        this.releaseLocks(olderTransaction[i]);
                        this.abortedId.push(olderTransaction[i]);
                    }
                }
            }
            console.log(isOlderThanAll);
            console.log("Current Transaction: " + currentTransaction);
            // Current transaction is older, so abort the older transaction (Wound-Wait)
            console.log("length: " + olderTransaction.length)
            // for (let i = 0; i < olderTransaction.length; i++) {
            //     this.releaseLocks(olderTransaction[i]);
            //     transactionLockSet.add(resource);
            //     resourceLock.exclusiveLock = transaction;
            //     // delete all older transaction from sequence
            //     for(let j = 0; j < this.sequence.length; j++) {
            //         console.log("olderTransaction[i]: " + olderTransaction[i]);     
            //         if(this.sequence[j].transaction === olderTransaction[i]) {
            //             this.aborted.push(this.sequence[j]);
            //             // this.resultTable.push({ transaction: olderTransaction[i], action: 'A', resource: resource });
            //         }
            //     }
            //     this.resultTable.push({ transaction: olderTransaction[i], action: 'A', resource: resource });
            //     this.sequence = this.sequence.filter((item) => item.transaction !== olderTransaction[i]);
            //     console.log("sequence after abort: ");
            //     console.log(this.sequence);
            //     console.log("aborted: " + this.aborted);
            // }
            if (isOlderThanAll) {
                transactionLockSet.add(resource);
                resourceLock.exclusiveLock = transaction;
                resourceLock.sharedLock.add(transaction);
                console.log(resourceLock.sharedLock);
                this.resultTable.push({ transaction: transaction, action: 'XL', resource: resource });
                this.resultTable.push({ transaction: transaction, action: 'W', resource: resource });
            }
            return true;
        // }
        } else {
            transactionLockSet.add(resource);

            if (!this.resourceMap.has(resource)) {
                this.resourceMap.set(resource, { sharedLock: new Set(), exclusiveLock: null });
            }

            const resourceLock = this.resourceMap.get(resource);

            if (action === 'R') {
                console.log("READ")
                resourceLock.sharedLock.add(transaction);
                this.resultTable.push({ transaction: transaction, action: 'SL', resource: resource })
            } else if (action === 'W') {
                resourceLock.exclusiveLock = transaction;
                resourceLock.sharedLock.add(transaction);
                this.resultTable.push({ transaction: transaction, action: 'XL', resource: resource })
            }
            this.resultTable.push({ transaction: transaction, action: action, resource: resource })
            return true;
        }
    }

    releaseLocks(transaction) {
        if (this.transactionLocks.has(transaction)) {
            const transactionLockSet = this.transactionLocks.get(transaction);

            transactionLockSet.forEach(resource => {
                const resourceLock = this.resourceMap.get(resource);

                if (resourceLock) {
                    resourceLock.sharedLock.delete(transaction);
                    if (resourceLock.exclusiveLock === transaction) {
                        resourceLock.exclusiveLock = null;
                    }
                }
            });

            this.transactionLocks.delete(transaction);
        }
    }

    execute() {
        let i = 0;
        while (i < this.sequence.length) {
            // console.log("QueueId: ", this.queueId)
            console.log(this.sequence[i]);

            if (!this.queueId.includes(this.sequence[i].transaction) && !this.abortedId.includes(this.sequence[i].transaction)) {    
                console.log("Iterasi " + i);
                console.log(this.sequence[i]);
                const { action, transaction, resource } = this.sequence[i];
                if (action === 'C') {
                    console.log('Commit')
                    this.resultTable.push({ transaction: transaction, action: 'C', resource: '-' });
                    this.releaseLocks(transaction);
                } else {
                    // let prev = this.sequence.length;
                    const success = this.applyLock(action, transaction, resource);
                    console.log(this.queue);
                    // let next = this.sequence.length;
                    // if (!success) {
                    //     // queued
                    //     let prevTransaction = this.resultTable[this.resultTable.length - 1].transaction;
                    //     let prevAction = this.resultTable[this.resultTable.length - 1].action;
                    //     let prevResource = this.resultTable[this.resultTable.length - 1].resource;
                    //     for (let j=0 ; j < this.sequence.length; j++) {
                    //         if (this.sequence[j].transaction === prevTransaction && this.sequence[j].action === prevAction && this.sequence[j].resource === prevResource) {
                    //             i = j;
                    //         }
                    //     }
                    // }
                    // if (prev !== next) {
                    //     // search for the next transaction (wound)
                    //     console.log("search for the next transaction (wound)");
                    //     for (let j = 0; j < this.sequence.length; j++) {
                    //         if (this.sequence[j].transaction === transaction && this.sequence[j].action === action) {
                    //             i = j;
                    //             console.log("i: " + i);
                    //             break;
                    //         }
                    //     }
                    // }
                }
                console.log("Transaction Locks Map:");
                console.log(this.transactionLocks);
                console.log("Resource Locks Map:");
                console.log(this.resourceMap);
            } else if (!this.abortedId.includes(this.sequence[i].transaction)){
                this.queue.push(this.sequence[i]);
                console.log("Push to queue ", this.sequence[i]);
                console.log(this.queue);
            }
            i +=1;
            console.log(i);
        }
        console.log("startQueue");
        console.log(this.queue);
        for (let i = 0; i < this.queue.length; i++) {
            console.log("Iterasi " + i);
            console.log(this.abortedId, this.queue[i].transaction);
            if (!this.abortedId.includes(this.queue[i].transaction)){    
                const { action, transaction, resource } = this.queue[i];
                if (action === 'C') {
                    console.log('Commit')
                    this.resultTable.push({ transaction: transaction, action: 'C', resource: '-' })
                    this.releaseLocks(transaction);
                } else {
                    const success = this.applyLock(action, transaction, resource);
                    console.log(success, action, transaction, resource);
                }
                console.log("Transaction Locks Map:");
                console.log(this.transactionLocks);
                console.log("Resource Locks Map:");
                console.log(this.resourceMap);
            }
        }
        // print aborted 
        this.aborted = this.sequence.filter(op => this.abortedId.includes(op.transaction));
        console.log("startAbort");
        console.log(this.abortedId);
        console.log(this.aborted);
        if (this.aborted.length > 0) {
            console.log("Aborted:");
            this.sequence = this.aborted;
            console.log(this.aborted);
            this.aborted = [];
            this.abortedId = [];
            this.queue = [];
            this.queueId = [];
            this.resourceMap = new Map();
            this.transactionLocks = new Map();
            this.execute();
        }
        
        // for(let i = 0; i < this.aborted.length; i++) {
        //     const { action, transaction, resource } = this.aborted[i];
        //     if (action === 'C') {
        //         console.log('Commit')
        //         this.releaseLocks(transaction);
        //     } else {
        //         const success = this.applyLock(action, transaction, resource);
        //     }
        // }
        // console.log("Final Transaction Locks Map:");
        // console.log(this.transactionLocks);
        // console.log("Final Resource Locks Map:");
        // console.log(this.resourceMap);
        
        console.log("Result Table:");
        for (let i = 0; i < this.resultTable.length; i++) {
            console.log(this.resultTable[i]);
        }
    }
}

export default TwoPhaseLockingAlgorithm;

// R1(X);W2(Y);W2(X);W3(Y);W1(Y);C1;C2;C3
// R1(A);R2(A);R3(B);W1(A);R2(C);R2(B);C3;W2(B);C2;W1(C);C1