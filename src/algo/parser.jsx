export default function Parser(sequence) {
    var operations = sequence.split(';').map(operation => operation.trim());
    var result = [];
  
    operations.forEach(operation => {
      var operationResult = operation.match(/([RW])(\d+)\((\w+)\)/);
      var commitResult = operation.match(/(C)(\d+)/);
      if (operationResult) {
        var [type, action, transaction, resource] = operationResult;
        result.push({ type, action, transaction, resource });
      } else if (commitResult) {
        var [type, action, transaction] = commitResult;
        result.push({ type, action, transaction, resource: '-' });
      }
    });
    return result;
}