export default function Parser(sequence) {
    var operations = sequence.split(';').map(operation => operation.trim());
    var result = [];
  
    operations.forEach(operation => {
      const matchResult = operation.match(/([RW])(\w+)\((\w+)\)/);
      const [type, transaction, resource] = matchResult || [];
      if (type && transaction && resource) {
        result.push({ type, transaction, resource });
      } else if (operation.startsWith('C')) {
        result.push({ type: 'C', transaction: 'C', resource: operation.substr(1) });
      }
    });
    return result;
  }  
