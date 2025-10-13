// Google Apps Script para actualizar Google Sheets
// Reemplaza 'TU_SHEET_ID' con tu ID real de la hoja
const SHEET_ID = '1NATfltQLyUKfRvyX1acz8qQYnkqjLy2kAy4IoLvVUYk';

function doPost(e) {
  try {
    // Parsear los datos recibidos
    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    // Actualizar jugadores
    if (data.jugadores) {
      updateJugadores(spreadsheet, data.jugadores);
    }
    
    // Actualizar partidos
    if (data.partidos) {
      updatePartidos(spreadsheet, data.partidos);
    }
    
    // Actualizar configuración
    if (data.configuracion) {
      updateConfiguracion(spreadsheet, data.configuracion);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Datos actualizados correctamente'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function updateJugadores(spreadsheet, jugadores) {
  const sheet = spreadsheet.getSheetByName('jugadores');
  
  // Limpiar datos existentes (excepto encabezados)
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  
  // Agregar nuevos datos
  jugadores.forEach((jugador, index) => {
    sheet.getRange(index + 2, 1, 1, 3).setValues([[
      jugador.id,
      jugador.nombre,
      jugador.goles
    ]]);
  });
}

function updatePartidos(spreadsheet, partidos) {
  const sheet = spreadsheet.getSheetByName('partidos');
  
  // Limpiar datos existentes (excepto encabezados)
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  
  // Agregar nuevos datos
  partidos.forEach((partido, index) => {
    sheet.getRange(index + 2, 1, 1, 3).setValues([[
      partido.id,
      partido.fecha,
      JSON.stringify(partido.goleadores)
    ]]);
  });
}

function updateConfiguracion(spreadsheet, configuracion) {
  const sheet = spreadsheet.getSheetByName('config');
  
  // Limpiar datos existentes (excepto encabezados)
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  
  // Agregar configuración
  const configs = Object.entries(configuracion);
  configs.forEach((config, index) => {
    sheet.getRange(index + 2, 1, 1, 2).setValues([[
      config[0], // key
      config[1]  // value
    ]]);
  });
}

// Función para permitir CORS
function doGet(e) {
  return ContentService
    .createTextOutput('Goleadores 2025 API funcionando')
    .setMimeType(ContentService.MimeType.TEXT);
}