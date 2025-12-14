// Google Apps Script para actualizar Google Sheets
const SHEET_ID = '1NATfltQLyUKfRvyX1acz8qQYnkqjLy2kAy4IoLvVUYk';

function doPost(e) {
  try {
    // LOG TEMPORAL PARA DEBUG
    Logger.log('Received e.parameter:', JSON.stringify(e.parameter));
    Logger.log('Received e.postData:', e.postData ? JSON.stringify(e.postData) : 'null');
    // Parsear los datos - pueden venir en postData.contents o en parameter.data
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter && e.parameter.data) {
      data = JSON.parse(e.parameter.data);
    } else {
      throw new Error('No se recibieron datos');
    }
    return processData(data);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  Logger.log('doGet iniciado');
  Logger.log('Parámetros recibidos:', JSON.stringify(e.parameter));
  
  // Manejar datos comprimidos
  if (e.parameter.compact) {
    try {
      Logger.log('Procesando datos comprimidos...');
      const compactData = JSON.parse(decodeURIComponent(e.parameter.compact));
      Logger.log('Datos comprimidos parseados:', JSON.stringify(compactData).substring(0, 200));
      // Descomprimir a formato original
      const data = {
        jugadores: compactData.j.map(j => ({id: j[0], nombre: j[1], goles: j[2]})),
        partidos: compactData.p.map(p => ({id: p[0], fecha: p[1], goleadores: p[2]})),
        configuracion: compactData.c
      };
      Logger.log('Datos descomprimidos - Jugadores:', data.jugadores.length);
      Logger.log('Datos descomprimidos - Partidos:', data.partidos.length);
      return processData(data);
    } catch (error) {
      Logger.log('ERROR en compact:', error.toString());
      return ContentService
        .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // Manejar tanto peticiones GET simples como con datos
  if (e.parameter.data) {
    try {
      const data = JSON.parse(decodeURIComponent(e.parameter.data));
      return processData(data);
    } catch (error) {
      Logger.log('ERROR en data:', error.toString());
      return ContentService
        .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // Respuesta simple para verificar que funciona
  Logger.log('Sin parámetros, devolviendo mensaje simple');
  return ContentService
    .createTextOutput('Goleadores 2025 API funcionando')
    .setMimeType(ContentService.MimeType.TEXT);
}

function processData(data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    // Permitir ambos formatos: antiguo y nuevo (compact)
    let jugadores, partidos, configuracion;
    if (data.compact) {
      // Nuevo formato: compact
      jugadores = (data.compact.j || []).map(j => ({ id: j[0], nombre: j[1], goles: j[2] }));
      partidos = (data.compact.p || []).map(p => ({ id: p[0], fecha: p[1], goleadores: p[2] }));
      configuracion = data.compact.c || {};
    } else {
      // Formato antiguo
      jugadores = data.jugadores;
      partidos = data.partidos;
      configuracion = data.configuracion;
    }
    // Actualizar jugadores
    if (jugadores) {
      updateJugadores(spreadsheet, jugadores);
    }
    // Actualizar partidos
    if (partidos) {
      updatePartidos(spreadsheet, partidos);
    }
    // Actualizar configuración
    if (configuracion) {
      updateConfiguracion(spreadsheet, configuracion);
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

