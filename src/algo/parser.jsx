export default function Parser(sequence) {
    var operations = sequence.split(';').map(operation => operation.trim());
    var result = [];
  
    operations.forEach(operation => {
      const matchResult = operation.match(/([RW])(\w+)\((\w+)\)/);
      const [type, action, transaction, resource] = matchResult || [];
      if (type && action &&transaction && resource) {
        result.push({ type, action, transaction, resource });
      } else if (operation.startsWith('C')) {
        result.push({ type: 'C'+transaction, action: 'C',transaction: transaction, resource: '-' });
      }
    });
    return result;
}