// Agregar esta función al final de tu Apps Script para probar permisos
function testPermissions() {
  try {
    const spreadsheet = SpreadsheetApp.openById('1NATfltQLyUKfRvyX1acz8qQYnkqjLy2kAy4IoLvVUYk');
    const sheet = spreadsheet.getSheetByName('jugadores');
    const lastRow = sheet.getLastRow();
    console.log('✅ Permisos OK - Última fila:', lastRow);
    return 'Permisos funcionando correctamente';
  } catch (error) {
    console.error('❌ Error de permisos:', error);
    return 'Error: ' + error.toString();
  }
}