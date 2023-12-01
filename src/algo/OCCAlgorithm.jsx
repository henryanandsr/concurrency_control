import Parser from "./parser";
export default function OCCAlgorithm(input, parsed) {
    if (parsed) {
        var sequence = input;
    } else {
        var sequence = Parser(input);
        console.log(sequence);
    }
    var startTimeStamp = {};
    var validationTimeStamp = {};
    var finishTimeStamp = {};
    var rolledBackTransactions = [];
    var currentTimeStamp = 0;
    // console.log("sequence: ", sequence);
    sequence.forEach(operation => {
        currentTimeStamp++;
        if (!startTimeStamp.hasOwnProperty(operation['transaction'])) {
            startTimeStamp[operation['transaction']] = currentTimeStamp;
            // console.log("starttimestamp ", operation['transaction'], " = ", startTimeStamp[operation['transaction']]);
        }
        if(operation['action']==='C') {
            // console.log("validationtimestamp ", operation['transaction'], " = ", validationTimeStamp[operation['transaction']]);
            
            let valid = true;
            // if (Object.keys(validationTimeStamp).length === 0) {
            //     valid = true;
            // }
            Object.entries(validationTimeStamp).forEach(([key, value]) => {
                if(key!==operation['transaction']) {
                    if(value<currentTimeStamp) {
                        let condition = false;
                        if (finishTimeStamp[key]<startTimeStamp[operation['transaction']]) {
                            console.log(operation['type'], " - ", finishTimeStamp[key], " - ", startTimeStamp[operation['transaction']])
                            condition = condition | true;
                        }
                        if (startTimeStamp[operation['transaction']] < finishTimeStamp[key] && finishTimeStamp[key] < currentTimeStamp) {
                            let writeSetKey = sequence.filter(op => op['action'] === 'W' && op['transaction'] == key).map(op => op['resource']);
                            let readSetCurrent = sequence.filter(op => op['action'] === 'R' && op['transaction'] == operation['transaction']).map(op => op['resource']);
                            // console.log("writeset: ", writeSetKey);
                            // console.log("readset: ", readSetCurrent);
                            if (!(writeSetKey.some(data => readSetCurrent.includes(data)))) {
                                console.log(operation['type'], " - ", writeSetKey, " - ", readSetCurrent)
                                condition = condition | true;
                            }
                        }
                        valid = valid && (condition);
                        
                        
                    }
                }
            });
            if (valid) {
                validationTimeStamp[operation['transaction']] = currentTimeStamp;
                currentTimeStamp++;
                finishTimeStamp[operation['transaction']] = currentTimeStamp;
            } else {
                rolledBackTransactions.push(operation['transaction']);
            }
        }
    });


    var originalSchedule = sequence.filter(operation => !rolledBackTransactions.includes(operation['transaction']));
    var rolledBackSchedule = [];

    originalSchedule.forEach(operation => {
        console.log(operation["type"]);
    })

    // case1, ini buat kalo transaksi yang di rollback, dijalanin semua sekaligus dengan urutan rollbacknya
    // rolledBackTransactions.forEach(transaction => {
    //     let rolledBackOperation = sequence.filter(operation => operation['transaction'] === transaction);
    //     rolledBackSchedule = rolledBackSchedule.concat(rolledBackOperation);
    // });
    // rolledBackSchedule.forEach(operation => {
    //     console.log(operation["type"]);
    // })

    // case2, ini buat kalo transaksi yang di rollback, dijalaninnya sesuai kedatangan di schedule awal
    rolledBackSchedule = sequence.filter(operation => rolledBackTransactions.includes(operation['transaction']));
    if (rolledBackSchedule.length>0) {
        return originalSchedule.map(operation => operation['type']).concat(OCCAlgorithm(rolledBackSchedule, true));
    } else {
        return originalSchedule.map(operation => operation['type']);
    }
}

// R1(A);R2(B);W2(B);R2(A);W2(A);W1(A);C1;C2
// R3(Y);R3(Z);R1(X);W1(X);W3(Y);W3(Z);C3;R2(Z);R1(Y);W1(Y);C1;R2(Y);W2(Y);R2(X);W2(X);C2