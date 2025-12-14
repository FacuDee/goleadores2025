class GoleadoresApp {
    constructor() {
        this.data = null;
        this.partidoActual = [];
        this.isAdminAuthenticated = false;
        this.adminPassword = 'goldechicho2025'; // Cambia esta contraseña por la que prefieras
        this.init();
    }

    async init() {
        await this.loadData();
        this.checkStoredSession(); // Verificar sesión guardada
        this.loadTheme(); // Cargar tema guardado
        this.setupEventListeners();
        this.renderRanking();
        this.updateStats();
        this.renderUltimoPartido();
        this.setupAdminPanel();
        console.log('Aplicación inicializada correctamente');
    }

    async loadData() {
        try {
            // Intentar cargar desde Google Sheets
            await this.loadFromGoogleSheets();
            console.log('Datos cargados desde Google Sheets:', this.data);
        } catch (error) {
            console.warn('Error cargando desde Google Sheets, usando datos locales:', error);
            try {
                // Fallback a localStorage
                const savedData = localStorage.getItem('goleadores-2025-data');
                if (savedData) {
                    this.data = JSON.parse(savedData);
                    console.log('Datos cargados desde localStorage:', this.data);
                    return;
                }
            } catch (localError) {
                console.warn('Error cargando desde localStorage:', localError);
            }
            
            // Último fallback: datos embebidos
            this.loadEmbeddedData();
        }
    }

    async loadFromGoogleSheets() {
        const SHEET_ID = '1NATfltQLyUKfRvyX1acz8qQYnkqjLy2kAy4IoLvVUYk';
        const API_KEY = 'AIzaSyCDZyHLuIXu9PSREPuEtDGXiFvSGo97CDA';
        const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`;

        // Cargar jugadores
        const jugadoresResponse = await fetch(`${BASE_URL}/jugadores!A:C?key=${API_KEY}`);
        const jugadoresData = await jugadoresResponse.json();
        
        // Cargar partidos
        const partidosResponse = await fetch(`${BASE_URL}/partidos!A:C?key=${API_KEY}`);
        const partidosData = await partidosResponse.json();
        
        // Cargar configuración
        const configResponse = await fetch(`${BASE_URL}/config!A:B?key=${API_KEY}`);
        const configData = await configResponse.json();

        // Procesar datos
        this.data = {
            jugadores: this.processJugadores(jugadoresData.values),
            partidos: this.processPartidos(partidosData.values),
            configuracion: this.processConfig(configData.values)
        };
    }

    processJugadores(rows) {
        if (!rows || rows.length <= 1) return [];
        
        return rows.slice(1).map(row => ({
            id: parseInt(row[0]) || 0,
            nombre: row[1] || '',
            goles: parseInt(row[2]) || 0
        })).filter(jugador => jugador.id > 0);
    }

    processPartidos(rows) {
        if (!rows || rows.length <= 1) return [];
        
        return rows.slice(1).map(row => {
            let goleadores = [];
            try {
                goleadores = row[2] ? JSON.parse(row[2]) : [];
            } catch (error) {
                console.warn('Error parsing goleadores for partido:', row[0], error);
            }
            
            return {
                id: parseInt(row[0]) || 0,
                fecha: row[1] || '',
                goleadores: goleadores
            };
        }).filter(partido => partido.id > 0);
    }

    processConfig(rows) {
        if (!rows || rows.length <= 1) {
            return {
                ultimoPartido: null,
                proximoPartido: "2025-10-13"
            };
        }
        
        const config = {};
        rows.slice(1).forEach(row => {
            const key = row[0];
            const value = row[1];
            
            if (key === 'ultimoPartido') {
                config[key] = value ? parseInt(value) : null;
            } else {
                config[key] = value || '';
            }
        });
        
        return config;
    }

    loadEmbeddedData() {
        // Datos de fallback embebidos
        this.data = {
            "jugadores": [
                {"id": 1, "nombre": "Fredy el optimista del gol", "goles": 45},
                {"id": 2, "nombre": "La Rata", "goles": 44},
                {"id": 3, "nombre": "Pablito", "goles": 32},
                {"id": 4, "nombre": "Facu", "goles": 27},
                {"id": 5, "nombre": "Juan cono naranja", "goles": 21},
                {"id": 6, "nombre": "Seba peluquería", "goles": 17},
                {"id": 7, "nombre": "Atilio", "goles": 15},
                {"id": 8, "nombre": "Cachi", "goles": 13},
                {"id": 9, "nombre": "Luisito", "goles": 13},
                {"id": 10, "nombre": "Lucho", "goles": 12},
                {"id": 11, "nombre": "Eze", "goles": 10},
                {"id": 12, "nombre": "Elías hijo de Claudio", "goles": 9},
                {"id": 13, "nombre": "Claudio", "goles": 9},
                {"id": 14, "nombre": "Nico Adorno", "goles": 8},
                {"id": 15, "nombre": "Cristian U.", "goles": 7},
                {"id": 16, "nombre": "Martin", "goles": 6},
                {"id": 17, "nombre": "Marcos el hacha", "goles": 5},
                {"id": 18, "nombre": "Santino", "goles": 5},
                {"id": 19, "nombre": "Santiago Rochita", "goles": 5},
                {"id": 20, "nombre": "Guille", "goles": 4},
                {"id": 21, "nombre": "Néstor", "goles": 4},
                {"id": 22, "nombre": "Agus", "goles": 4},
                {"id": 23, "nombre": "Adriano", "goles": 4},
                {"id": 24, "nombre": "Kuki", "goles": 3},
                {"id": 25, "nombre": "Dario la pantera", "goles": 3},
                {"id": 26, "nombre": "Ema capitan", "goles": 2},
                {"id": 27, "nombre": "Luis", "goles": 2},
                {"id": 28, "nombre": "Nacho", "goles": 2},
                {"id": 29, "nombre": "Carlos", "goles": 2},
                {"id": 30, "nombre": "Pancho", "goles": 2},
                {"id": 31, "nombre": "Ema (2)", "goles": 2},
                {"id": 32, "nombre": "Juan Celis", "goles": 1},
                {"id": 33, "nombre": "Nico", "goles": 1},
                {"id": 34, "nombre": "Nicolás Suárez", "goles": 1},
                {"id": 35, "nombre": "Fermín", "goles": 1},
                {"id": 36, "nombre": "Dieguito", "goles": 1},
                {"id": 37, "nombre": "Rodrigo", "goles": 1},
                {"id": 38, "nombre": "Charly", "goles": 1},
                {"id": 39, "nombre": "Cristian Dc.", "goles": 1},
                {"id": 40, "nombre": "Ruso", "goles": 1}
            ],
            "partidos": [],
            "configuracion": {
                "ultimoPartido": null,
                "proximoPartido": "2025-10-13"  
            }
        };
        
        console.log('Datos embebidos cargados como fallback:', this.data);
    }

    async saveData() {
        try {
            // Guardar en localStorage del navegador para persistencia local
            localStorage.setItem('goleadores-2025-data', JSON.stringify(this.data));
            console.log('Datos guardados en localStorage:', this.data);
            
            // Intentar guardar en Google Sheets
            await this.saveToGoogleSheets();
            
            this.showNotification('Datos guardados correctamente', 'success');
            
            // Actualizar la interfaz
            this.renderRanking();
            this.updateStats();
            this.renderUltimoPartido();
            
            return true;
        } catch (error) {
            console.error('Error guardando datos:', error);
            this.showNotification('Error al guardar los datos', 'error');
            return false;
        }
    }

    async saveToGoogleSheets() {
        const BACKEND_URL = 'https://backend-goleadores2025.vercel.app/api/guardar';
        console.log('🔄 Intentando guardar en Google Sheets...');
        console.log('📊 Datos a enviar:', this.data);
        try {
            // Comprimir datos eliminando espacios innecesarios
            const compactData = {
                j: this.data.jugadores.map(j => [j.id, j.nombre, j.goles]),
                p: this.data.partidos.map(p => [p.id, p.fecha, p.goleadores]),
                c: this.data.configuracion
            };
            // Enviar datos como JSON usando POST
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ compact: compactData })
            });
            if (!response.ok) {
                throw new Error('Respuesta no OK del servidor');
            }
            const result = await response.text();
            console.log('✅ Datos enviados a Google Sheets', result);
            this.showNotification('Sincronizado con Google Sheets', 'success');
        } catch (error) {
            console.error('❌ Error guardando en Google Sheets:', error);
            this.showNotification('Error de sincronización - datos guardados localmente', 'warning');
        }
    }

    setupEventListeners() {
        // Navegación
        document.getElementById('btn-ranking').addEventListener('click', () => {
            this.showSection('ranking');
        });
        
        document.getElementById('btn-admin').addEventListener('click', () => {
            this.requestAdminAccess();
        });

        // Búsqueda
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filterRanking(e.target.value);
        });

        // Admin panel
        document.getElementById('btn-add-gol').addEventListener('click', () => {
            this.addGolToPartido();
        });

        document.getElementById('btn-save-partido').addEventListener('click', () => {
            this.savePartido();
        });

        document.getElementById('btn-clear-partido').addEventListener('click', () => {
            this.clearPartido();
        });

        document.getElementById('btn-add-manual-gol').addEventListener('click', () => {
            this.addManualGol();
        });

        document.getElementById('btn-remove-gol').addEventListener('click', () => {
            this.removeManualGol();
        });

        // Logout
        document.getElementById('btn-logout').addEventListener('click', () => {
            this.logout();
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Modal
        document.getElementById('btn-cancel').addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('btn-confirm').addEventListener('click', () => {
            this.confirmAction();
        });

        // Login modal
        document.getElementById('btn-login-cancel').addEventListener('click', () => {
            this.hideLoginModal();
        });

        document.getElementById('btn-login-confirm').addEventListener('click', () => {
            this.attemptLogin();
        });

        // Enter key en el campo de contraseña
        document.getElementById('admin-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.attemptLogin();
            }
        });

        // Scroll to top button
        document.getElementById('scroll-to-top').addEventListener('click', () => {
            this.scrollToTop();
        });

        // Scroll event para mostrar/ocultar el botón
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Configurar fecha por defecto
        const fechaInput = document.getElementById('fecha-partido');
        fechaInput.value = this.getNextSunday();
    }

    requestAdminAccess() {
        if (this.isAdminAuthenticated) {
            this.showSection('admin');
        } else {
            this.showLoginModal();
        }
    }

    showLoginModal() {
        document.getElementById('login-modal').style.display = 'block';
        document.getElementById('admin-password').value = '';
        document.getElementById('login-error').style.display = 'none';
        // Focus en el campo de contraseña
        setTimeout(() => {
            document.getElementById('admin-password').focus();
        }, 100);
    }

    hideLoginModal() {
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('admin-password').value = '';
        document.getElementById('login-error').style.display = 'none';
    }

    attemptLogin() {
        const password = document.getElementById('admin-password').value;
        
        if (password === this.adminPassword) {
            this.isAdminAuthenticated = true;
            this.hideLoginModal();
            this.showSection('admin');
            this.showNotification('Acceso autorizado', 'success');
            
            // Guardar sesión por 1 hora
            const expirationTime = new Date().getTime() + (60 * 60 * 1000); // 1 hora
            localStorage.setItem('goleadores-admin-session', JSON.stringify({
                authenticated: true,
                expires: expirationTime
            }));
        } else {
            document.getElementById('login-error').style.display = 'block';
            document.getElementById('admin-password').value = '';
            document.getElementById('admin-password').focus();
            this.showNotification('Contraseña incorrecta', 'error');
        }
    }

    checkStoredSession() {
        try {
            const session = localStorage.getItem('goleadores-admin-session');
            if (session) {
                const sessionData = JSON.parse(session);
                const now = new Date().getTime();
                
                if (sessionData.authenticated && sessionData.expires > now) {
                    this.isAdminAuthenticated = true;
                    return true;
                } else {
                    // Sesión expirada
                    localStorage.removeItem('goleadores-admin-session');
                }
            }
        } catch (error) {
            console.warn('Error checking stored session:', error);
            localStorage.removeItem('goleadores-admin-session');
        }
        return false;
    }

    logout() {
        this.isAdminAuthenticated = false;
        localStorage.removeItem('goleadores-admin-session');
        this.showSection('ranking');
        this.showNotification('Sesión cerrada', 'info');
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Los iconos se actualizan automáticamente con CSS
        // No necesitamos cambiar el contenido del SVG
        
        // Guardar preferencia
        localStorage.setItem('goleadores-theme', theme);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('goleadores-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Usar tema guardado o preferencia del sistema
        const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        
        this.setTheme(theme);
    }

    showSection(section) {
        // Ocultar todas las secciones
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Ocultar todos los botones de navegación
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Mostrar sección seleccionada
        document.getElementById(`${section}-section`).classList.add('active');
        document.getElementById(`btn-${section}`).classList.add('active');
    }

    renderRanking() {
        const rankingList = document.getElementById('ranking-list');
        const verMasBtn = document.getElementById('btn-ver-mas');
        // Ordenar jugadores por goles (descendente)
        this.jugadoresOrdenados = [...this.data.jugadores].sort((a, b) => b.goles - a.goles);
        this.rankingOffset = this.rankingOffset || 0;
        rankingList.innerHTML = '';
        const mostrarHasta = Math.min(this.rankingOffset + 10, this.jugadoresOrdenados.length);
        for (let i = 0; i < mostrarHasta; i++) {
            const jugadorElement = this.createJugadorElement(this.jugadoresOrdenados[i], i + 1);
            rankingList.appendChild(jugadorElement);
        }
        // Mostrar/ocultar botón Ver más
        if (mostrarHasta < this.jugadoresOrdenados.length) {
            verMasBtn.style.display = 'inline-block';
            verMasBtn.onclick = () => {
                this.rankingOffset += 10;
                this.renderRanking();
            };
        } else {
            verMasBtn.style.display = 'none';
            verMasBtn.onclick = null;
        }
    }

    createJugadorElement(jugador, posicion) {
        const div = document.createElement('div');
        div.className = 'jugador-item';
        
        // Agregar clases especiales para el podium
        if (posicion === 1) div.classList.add('podium-1');
        if (posicion === 2) div.classList.add('podium-2');
        if (posicion === 3) div.classList.add('podium-3');
        
        div.innerHTML = `
            <div class="jugador-info">
                <div class="posicion">${posicion}</div>
                <div class="nombre">${jugador.nombre}</div>
            </div>
            <div class="goles">${jugador.goles}</div>
        `;
        
        return div;
    }

    filterRanking(searchTerm) {
        // Reiniciar offset para búsqueda
        this.rankingOffset = 0;
        if (!this.jugadoresOrdenados) {
            this.jugadoresOrdenados = [...this.data.jugadores].sort((a, b) => b.goles - a.goles);
        }
        // Filtrar jugadores
        this.jugadoresFiltrados = this.jugadoresOrdenados.filter(jugador =>
            jugador.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
        // Renderizar solo los filtrados
        const rankingList = document.getElementById('ranking-list');
        rankingList.innerHTML = '';
        const mostrarHasta = Math.min(this.rankingOffset + 10, this.jugadoresFiltrados.length);
        for (let i = 0; i < mostrarHasta; i++) {
            const jugadorElement = this.createJugadorElement(this.jugadoresFiltrados[i], i + 1);
            rankingList.appendChild(jugadorElement);
        }
        // Mostrar/ocultar botón Ver más
        const verMasBtn = document.getElementById('btn-ver-mas');
        if (mostrarHasta < this.jugadoresFiltrados.length) {
            verMasBtn.style.display = 'inline-block';
            verMasBtn.onclick = () => {
                this.rankingOffset += 10;
                // Renderizar más filtrados
                rankingList.innerHTML = '';
                const nuevoHasta = Math.min(this.rankingOffset + 10, this.jugadoresFiltrados.length);
                for (let i = 0; i < nuevoHasta; i++) {
                    const jugadorElement = this.createJugadorElement(this.jugadoresFiltrados[i], i + 1);
                    rankingList.appendChild(jugadorElement);
                }
                if (nuevoHasta >= this.jugadoresFiltrados.length) {
                    verMasBtn.style.display = 'none';
                    verMasBtn.onclick = null;
                }
            };
        } else {
            verMasBtn.style.display = 'none';
            verMasBtn.onclick = null;
        }
    }

    updateStats() {
        const totalJugadores = this.data.jugadores.length;
        const totalGoles = this.data.jugadores.reduce((sum, jugador) => sum + jugador.goles, 0);

        document.getElementById('total-jugadores').textContent = totalJugadores;
        document.getElementById('total-goles').textContent = totalGoles;
    }

    renderUltimoPartido() {
        const panel = document.getElementById('ultimo-partido-panel');
        
        if (!this.data.configuracion.ultimoPartido || this.data.partidos.length === 0) {
            panel.style.display = 'none';
            return;
        }

        const ultimoPartido = this.data.partidos.find(p => p.id === this.data.configuracion.ultimoPartido);
        if (!ultimoPartido) {
            panel.style.display = 'none';
            return;
        }

        panel.style.display = 'block';
        
        // Actualizar fecha
        const fechaParts = ultimoPartido.fecha.split('-');
        const fecha = new Date(fechaParts[0], fechaParts[1] - 1, fechaParts[2]);
        document.getElementById('fecha-ultimo-partido').textContent = 
            fecha.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });

        // Contar goles por equipo
        const golesArroyo = ultimoPartido.goleadores.filter(g => g.equipo === 'arroyo').length;
        const golesParque = ultimoPartido.goleadores.filter(g => g.equipo === 'parque').length;

        document.getElementById('goles-arroyo').textContent = golesArroyo;
        document.getElementById('goles-parque').textContent = golesParque;

        // Mostrar goleadores por equipo
        this.renderGoleadoresUltimoPartido(ultimoPartido);
    }

    renderGoleadoresUltimoPartido(partido) {
        const container = document.getElementById('goleadores-partido');
        
        // Agrupar goleadores por equipo
        const goleadoresArroyo = {};
        const goleadoresParque = {};

        partido.goleadores.forEach(gol => {
            const contenedor = gol.equipo === 'arroyo' ? goleadoresArroyo : goleadoresParque;
            contenedor[gol.jugadorNombre] = (contenedor[gol.jugadorNombre] || 0) + 1;
        });

        container.innerHTML = `
            <div class="goleadores-equipo">
                <h4>Goles</h4>
                ${Object.entries(goleadoresArroyo).map(([nombre, goles]) => 
                    `<div class="goleador-item">${nombre} (${goles})</div>`
                ).join('') || '<div class="goleador-item">Sin goles</div>'}
            </div>
            <div class="goleadores-equipo">
                <h4>Goles</h4>
                ${Object.entries(goleadoresParque).map(([nombre, goles]) => 
                    `<div class="goleador-item">${nombre} (${goles})</div>`
                ).join('') || '<div class="goleador-item">Sin goles</div>'}
            </div>
        `;
    }

    setupAdminPanel() {
        this.populateJugadorSelects();
        this.renderGolesPartido();
    }

    populateJugadorSelects() {
        const jugadorSelect = document.getElementById('jugador-select');
        const jugadorManualSelect = document.getElementById('jugador-manual-select');
        
        // Limpiar selects
        jugadorSelect.innerHTML = '<option value="">Seleccionar jugador...</option>';
        jugadorManualSelect.innerHTML = '<option value="">Seleccionar jugador...</option>';
        
        // Ordenar jugadores alfabéticamente
        const jugadoresOrdenados = [...this.data.jugadores].sort((a, b) => 
            a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
        );
        
        jugadoresOrdenados.forEach(jugador => {
            const option1 = document.createElement('option');
            option1.value = jugador.id;
            option1.textContent = jugador.nombre;
            
            const option2 = document.createElement('option');
            option2.value = jugador.id;
            option2.textContent = `${jugador.nombre} (${jugador.goles} goles)`;
            
            jugadorSelect.appendChild(option1);
            jugadorManualSelect.appendChild(option2);
        });
    }

    addGolToPartido() {
        const jugadorSelect = document.getElementById('jugador-select');
        const equipoSelect = document.getElementById('equipo-select');
        const jugadorId = parseInt(jugadorSelect.value);
        const equipo = equipoSelect.value;
        
        if (!jugadorId) {
            this.showNotification('Por favor selecciona un jugador', 'warning');
            return;
        }
        
        if (!equipo) {
            this.showNotification('Por favor selecciona un equipo', 'warning');
            return;
        }
        
        const jugador = this.data.jugadores.find(j => j.id === jugadorId);
        if (!jugador) {
            this.showNotification('Jugador no encontrado', 'error');
            return;
        }
        
        // Agregar gol al partido actual
        this.partidoActual.push({
            jugadorId: jugadorId,
            jugadorNombre: jugador.nombre,
            equipo: equipo
        });
        
        // Limpiar selecciones
        jugadorSelect.value = '';
        equipoSelect.value = '';
        
        // Actualizar vista
        this.renderGolesPartido();
        
        const equipoNombre = equipo === 'arroyo' ? 'Defensores del Arroyo' : 'Defensores del Parque';
        this.showNotification(`Gol agregado para ${jugador.nombre} (${equipoNombre})`, 'success');
    }

    renderGolesPartido() {
        if (this.partidoActual.length === 0) {
            document.getElementById('goles-arroyo-admin').textContent = '0';
            document.getElementById('goles-parque-admin').textContent = '0';
            document.getElementById('goleadores-arroyo-admin').innerHTML = '';
            document.getElementById('goleadores-parque-admin').innerHTML = '';
            return;
        }
        
        // Contar goles por equipo
        const golesArroyo = this.partidoActual.filter(g => g.equipo === 'arroyo').length;
        const golesParque = this.partidoActual.filter(g => g.equipo === 'parque').length;
        
        document.getElementById('goles-arroyo-admin').textContent = golesArroyo;
        document.getElementById('goles-parque-admin').textContent = golesParque;
        
        // Agrupar goleadores por equipo
        const goleadoresArroyo = {};
        const goleadoresParque = {};
        
        this.partidoActual.forEach(gol => {
            const contenedor = gol.equipo === 'arroyo' ? goleadoresArroyo : goleadoresParque;
            if (!contenedor[gol.jugadorId]) {
                contenedor[gol.jugadorId] = {
                    nombre: gol.jugadorNombre,
                    cantidad: 0
                };
            }
            contenedor[gol.jugadorId].cantidad++;
        });
        
        // Renderizar goleadores del Arroyo
        const arroyoContainer = document.getElementById('goleadores-arroyo-admin');
        arroyoContainer.innerHTML = '';
        Object.entries(goleadoresArroyo).forEach(([jugadorId, info]) => {
            const golElement = document.createElement('div');
            golElement.className = 'goleador-admin-item';
            golElement.innerHTML = `
                ${info.nombre} (${info.cantidad})
                <button class="gol-remove" onclick="app.removeGolFromPartido(${jugadorId}, 'arroyo')" style="margin-left: 5px; font-size: 0.7rem;">×</button>
            `;
            arroyoContainer.appendChild(golElement);
        });
        
        // Renderizar goleadores del Parque
        const parqueContainer = document.getElementById('goleadores-parque-admin');
        parqueContainer.innerHTML = '';
        Object.entries(goleadoresParque).forEach(([jugadorId, info]) => {
            const golElement = document.createElement('div');
            golElement.className = 'goleador-admin-item';
            golElement.innerHTML = `
                ${info.nombre} (${info.cantidad})
                <button class="gol-remove" onclick="app.removeGolFromPartido(${jugadorId}, 'parque')" style="margin-left: 5px; font-size: 0.7rem;">×</button>
            `;
            parqueContainer.appendChild(golElement);
        });
    }

    removeGolFromPartido(jugadorId, equipo) {
        const index = this.partidoActual.findIndex(gol => 
            gol.jugadorId === parseInt(jugadorId) && gol.equipo === equipo
        );
        if (index !== -1) {
            const jugadorNombre = this.partidoActual[index].jugadorNombre;
            const equipoNombre = equipo === 'arroyo' ? 'Defensores del Arroyo' : 'Defensores del Parque';
            this.partidoActual.splice(index, 1);
            this.renderGolesPartido();
            this.showNotification(`Gol removido de ${jugadorNombre} (${equipoNombre})`, 'info');
        }
    }

    async savePartido() {
        if (this.partidoActual.length === 0) {
            this.showNotification('No hay goles para guardar', 'warning');
            return;
        }
        
        const fecha = document.getElementById('fecha-partido').value;
        if (!fecha) {
            this.showNotification('Por favor selecciona una fecha', 'warning');
            return;
        }
        
        const message = `¿Confirmas guardar el partido del ${fecha} con ${this.partidoActual.length} gol${this.partidoActual.length > 1 ? 'es' : ''}?`;
        
        this.showModal(message, async () => {
            // Actualizar goles de jugadores
            this.partidoActual.forEach(gol => {
                const jugador = this.data.jugadores.find(j => j.id === gol.jugadorId);
                if (jugador) {
                    jugador.goles++;
                }
            });
            
            // Crear nuevo partido
            const nuevoPartido = {
                id: this.data.partidos.length + 1,
                fecha: fecha,
                goleadores: [...this.partidoActual]
            };
            
            this.data.partidos.push(nuevoPartido);
            this.data.configuracion.ultimoPartido = nuevoPartido.id;
            
            // Guardar datos
            await this.saveData();
            
            // Limpiar partido actual
            this.partidoActual = [];
            this.renderGolesPartido();
            
            // Actualizar fecha al próximo domingo
            document.getElementById('fecha-partido').value = this.getNextSunday();
            
            this.showNotification('Partido guardado exitosamente', 'success');
        });
    }

    clearPartido() {
        if (this.partidoActual.length === 0) {
            this.showNotification('No hay goles para limpiar', 'info');
            return;
        }
        
        this.showModal('¿Estás seguro de que quieres limpiar todos los goles del partido actual?', () => {
            this.partidoActual = [];
            this.renderGolesPartido();
            this.showNotification('Partido limpiado', 'info');
        });
    }

    addManualGol() {
        const select = document.getElementById('jugador-manual-select');
        const jugadorId = parseInt(select.value);
        
        if (!jugadorId) {
            this.showNotification('Por favor selecciona un jugador', 'warning');
            return;
        }
        
        const jugador = this.data.jugadores.find(j => j.id === jugadorId);
        if (!jugador) {
            this.showNotification('Jugador no encontrado', 'error');
            return;
        }
        
        this.showModal(`¿Confirmas agregar 1 gol a ${jugador.nombre}?`, async () => {
            jugador.goles++;
            await this.saveData();
            this.populateJugadorSelects(); // Actualizar los selects con los nuevos totales
            this.showNotification(`Gol agregado a ${jugador.nombre}`, 'success');
        });
    }

    removeManualGol() {
        const select = document.getElementById('jugador-manual-select');
        const jugadorId = parseInt(select.value);
        
        if (!jugadorId) {
            this.showNotification('Por favor selecciona un jugador', 'warning');
            return;
        }
        
        const jugador = this.data.jugadores.find(j => j.id === jugadorId);
        if (!jugador) {
            this.showNotification('Jugador no encontrado', 'error');
            return;
        }
        
        if (jugador.goles <= 0) {
            this.showNotification(`${jugador.nombre} ya tiene 0 goles`, 'warning');
            return;
        }
        
        this.showModal(`¿Confirmas quitar 1 gol a ${jugador.nombre}?`, async () => {
            jugador.goles--;
            await this.saveData();
            this.populateJugadorSelects(); // Actualizar los selects con los nuevos totales
            this.showNotification(`Gol removido de ${jugador.nombre}`, 'info');
        });
    }

    showModal(message, confirmCallback) {
        document.getElementById('modal-message').textContent = message;
        document.getElementById('confirmation-modal').style.display = 'block';
        this.currentConfirmCallback = confirmCallback;
    }

    hideModal() {
        document.getElementById('confirmation-modal').style.display = 'none';
        this.currentConfirmCallback = null;
    }

    confirmAction() {
        if (this.currentConfirmCallback) {
            this.currentConfirmCallback();
        }
        this.hideModal();
    }

    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1001;
            max-width: 300px;
            word-wrap: break-word;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        `;
        
        // Colores según el tipo
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        
        // Agregar al DOM
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        console.log(`${type.toUpperCase()}: ${message}`);
    }

    getNextSunday() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek;
        const nextSunday = new Date(today.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000);
        return nextSunday.toISOString().split('T')[0];
    }

    // Método para exportar datos (para desarrollo/debug)
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'goleadores-backup.json';
        link.click();
        URL.revokeObjectURL(url);
        this.showNotification('Datos exportados correctamente', 'success');
    }

    // Método para resetear datos a los valores iniciales
    resetData() {
        this.showModal('¿Estás seguro de que quieres resetear todos los datos a los valores iniciales? Esta acción no se puede deshacer.', () => {
            localStorage.removeItem('goleadores-2025-data');
            location.reload(); // Recargar la página para usar datos iniciales
        });
    }

    // Método para limpiar localStorage
    clearStorage() {
        localStorage.removeItem('goleadores-2025-data');
        this.showNotification('Datos del navegador limpiados', 'info');
    }

    // Método para cambiar contraseña (para el desarrollador)
    changeAdminPassword(newPassword) {
        if (typeof newPassword === 'string' && newPassword.length >= 6) {
            this.adminPassword = newPassword;
            this.showNotification('Contraseña de admin actualizada', 'success');
            console.log('Nueva contraseña establecida:', newPassword);
        } else {
            console.error('La contraseña debe ser una cadena de al menos 6 caracteres');
        }
    }

    // Métodos para scroll to top
    handleScroll() {
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Mostrar el botón después de hacer scroll de 300px
        if (scrollPosition > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Inicializar la aplicación cuando el DOM esté listo
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new GoleadoresApp();
});

// Hacer la app disponible globalmente para debugging
window.app = app;

// Atajos de teclado para desarrollo
document.addEventListener('keydown', (e) => {
    if (!app) return;
    
    // Ctrl + E para exportar datos
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        app.exportData();
    }
    
    // Ctrl + R para resetear datos (requiere confirmación)
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        app.resetData();
    }
    
    // Ctrl + L para limpiar localStorage
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        app.clearStorage();
    }
    
    // Escape para logout si está en admin
    if (e.key === 'Escape' && app.isAdminAuthenticated) {
        app.logout();
    }
});