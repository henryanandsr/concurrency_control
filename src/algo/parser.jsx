export default function Parser(sequence) {
    var operations = sequence.split(';').map(operation => operation.trim());

    var transactions = {};
    var result = [];

    operations.forEach(operation => {
        const [type, transaction, resource] = operation.match(/([RW])(\d+)\((\w+)\)/) || [];
        if (type && transaction && resource) {
            if (!transactions[transaction]) {
                transactions[transaction] = { readSet: new Set(), writeSet: new Set() };
            }

            if (type === 'R') {
                transactions[transaction].readSet.add(resource);
            } else if (type === 'W') {
                transactions[transaction].writeSet.add(resource);
            }

            result.push({ type, transaction, resource });
        } else if (operation.startsWith('C')) {
            result.push({ type: 'C' + operation.substr(1), transaction: 'C', resource: operation.substr(1) });
        }
    });

    return result;
}
