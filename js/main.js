// Globale Variablen
let currentWeekStart = null;
let allShifts = [];
let currentEditEntry = null; // Für Export im Modal
const employees = ['Tamara', 'Diana', 'Diko'];

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', async () => {
    // Starte mit der aktuellen Woche
    const today = new Date();
    currentWeekStart = getMonday(today);
    
    // Event Listeners
    document.getElementById('prevWeek').addEventListener('click', () => changeWeek(-1));
    document.getElementById('nextWeek').addEventListener('click', () => changeWeek(1));
    document.getElementById('todayBtn').addEventListener('click', () => goToToday());
    document.getElementById('entryForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('entryType').addEventListener('change', handleTypeChange);
    
    // Export Dropdown
    const exportBtn = document.getElementById('exportBtn');
    const exportMenu = document.getElementById('exportMenu');
    exportBtn.addEventListener('click', () => {
        exportMenu.style.display = exportMenu.style.display === 'block' ? 'none' : 'block';
    });
    
    // Schließe Dropdown beim Klick außerhalb
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.export-dropdown')) {
            exportMenu.style.display = 'none';
        }
    });
    
    // Lade Daten und zeige Kalender
    await loadShifts();
    renderCalendar();
});

// Hilfsfunktion: Hole Montag der Woche
function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

// Hole ISO Wochennummer
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Woche wechseln
function changeWeek(direction) {
    currentWeekStart.setDate(currentWeekStart.getDate() + (direction * 7));
    renderCalendar();
}

// Zu heute springen
function goToToday() {
    currentWeekStart = getMonday(new Date());
    renderCalendar();
}

// Lade alle Schichten aus der Datenbank
async function loadShifts() {
    try {
        const response = await fetch('tables/shifts?limit=1000');
        const data = await response.json();
        allShifts = data.data || [];
    } catch (error) {
        console.error('Fehler beim Laden der Schichten:', error);
        allShifts = [];
    }
}

// Kalender rendern
function renderCalendar() {
    const weekNumber = getWeekNumber(currentWeekStart);
    const year = currentWeekStart.getFullYear();
    
    // Header aktualisieren
    document.getElementById('weekDisplay').textContent = `Woche ${weekNumber}, ${year}`;
    
    const endDate = new Date(currentWeekStart);
    endDate.setDate(endDate.getDate() + 6);
    
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const startStr = currentWeekStart.toLocaleDateString('de-DE', { day: '2-digit', month: 'long' });
    const endStr = endDate.toLocaleDateString('de-DE', options);
    document.getElementById('dateRange').textContent = `${startStr} - ${endStr}`;
    
    // Kalender-Grid erstellen
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    // Tage der Woche generieren
    const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(currentWeekStart);
        currentDate.setDate(currentDate.getDate() + i);
        
        // Tag-Spalte erstellen
        const dayColumn = document.createElement('div');
        dayColumn.className = 'day-column';
        
        // Header für Tag
        const isToday = isSameDay(currentDate, new Date());
        const dayHeader = document.createElement('div');
        dayHeader.className = `day-header ${isToday ? 'today' : ''}`;
        dayHeader.innerHTML = `
            <div class="day-name">${days[i]}</div>
            <div class="day-date">${currentDate.getDate()}.${currentDate.getMonth() + 1}.</div>
        `;
        dayColumn.appendChild(dayHeader);
        
        // Zellen für jeden Mitarbeiter
        employees.forEach(employee => {
            const cell = createEmployeeCell(employee, currentDate);
            dayColumn.appendChild(cell);
        });
        
        calendarDays.appendChild(dayColumn);
    }
}

// Erstelle Mitarbeiter-Zelle für einen Tag
function createEmployeeCell(employee, date) {
    const cell = document.createElement('div');
    cell.className = 'day-cell';
    
    const dateStr = date.toISOString().split('T')[0];
    
    // Prüfe auf Feiertag
    const holiday = getHolidayForEmployee(date, employee);
    
    // Hole alle Einträge für diesen Mitarbeiter und Tag
    const entries = allShifts.filter(shift => 
        shift.employee === employee && shift.date === dateStr
    );
    
    // Wenn Feiertag und keine anderen Einträge, zeige Feiertag
    if (holiday && entries.length === 0) {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry holiday';
        entryDiv.innerHTML = `
            <i class="fas fa-star"></i>
            <div class="entry-label">${holiday}</div>
        `;
        cell.appendChild(entryDiv);
    }
    
    // Zeige alle Einträge
    entries.forEach(entry => {
        const entryDiv = createEntryElement(entry);
        cell.appendChild(entryDiv);
    });
    
    // Plus-Button zum Hinzufügen
    const addBtn = document.createElement('button');
    addBtn.className = 'add-btn';
    addBtn.innerHTML = '<i class="fas fa-plus"></i>';
    addBtn.onclick = () => openModal(employee, dateStr);
    cell.appendChild(addBtn);
    
    return cell;
}

// Erstelle Entry-Element
function createEntryElement(entry) {
    const div = document.createElement('div');
    div.className = `entry ${entry.type}`;
    
    let icon = 'fa-briefcase';
    let label = '';
    
    switch(entry.type) {
        case 'shift':
            icon = 'fa-briefcase';
            label = `${entry.start_time || ''} - ${entry.end_time || ''}`;
            break;
        case 'vacation':
            icon = 'fa-umbrella-beach';
            label = 'Urlaub';
            break;
        case 'sick':
            icon = 'fa-notes-medical';
            label = 'Krank';
            break;
        case 'overtime':
            icon = 'fa-clock';
            label = `Überstunden: ${entry.start_time || ''} - ${entry.end_time || ''}`;
            break;
        case 'holiday':
            icon = 'fa-star';
            label = 'Feiertag';
            break;
    }
    
    div.innerHTML = `
        <i class="fas ${icon}"></i>
        <div class="entry-label">${label}</div>
        ${entry.notes ? `<div class="entry-notes">${entry.notes}</div>` : ''}
    `;
    
    // Klick zum Bearbeiten/Löschen
    div.onclick = () => openEditModal(entry);
    
    return div;
}

// Modal öffnen (Neuer Eintrag)
function openModal(employee, date) {
    const modal = document.getElementById('entryModal');
    const form = document.getElementById('entryForm');
    
    // Reset form
    form.reset();
    document.getElementById('entryId').value = '';
    document.getElementById('entryEmployee').value = employee;
    document.getElementById('entryDate').value = date;
    
    // Anzeige
    document.getElementById('modalTitle').textContent = 'Eintrag hinzufügen';
    document.getElementById('displayEmployee').textContent = employee;
    
    const dateObj = new Date(date + 'T12:00:00');
    const dateStr = dateObj.toLocaleDateString('de-DE', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('displayDate').textContent = dateStr;
    
    // Zeitfelder initial anzeigen
    document.getElementById('timeFields').style.display = 'block';
    document.getElementById('startTime').required = true;
    document.getElementById('endTime').required = true;
    
    modal.style.display = 'flex';
}

// Modal öffnen (Bearbeiten)
function openEditModal(entry) {
    const modal = document.getElementById('entryModal');
    const form = document.getElementById('entryForm');
    
    // Speichere Entry für Export
    currentEditEntry = entry;
    
    // Fülle Form mit Daten
    document.getElementById('entryId').value = entry.id;
    document.getElementById('entryEmployee').value = entry.employee;
    document.getElementById('entryDate').value = entry.date;
    document.getElementById('entryType').value = entry.type;
    document.getElementById('startTime').value = entry.start_time || '';
    document.getElementById('endTime').value = entry.end_time || '';
    document.getElementById('notes').value = entry.notes || '';
    
    // Anzeige
    document.getElementById('modalTitle').textContent = 'Eintrag bearbeiten';
    document.getElementById('displayEmployee').textContent = entry.employee;
    
    const dateObj = new Date(entry.date + 'T12:00:00');
    const dateStr = dateObj.toLocaleDateString('de-DE', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('displayDate').textContent = dateStr;
    
    // Zeitfelder anzeigen/verbergen
    handleTypeChange();
    
    modal.style.display = 'flex';
    
    // Export-Button für diesen Eintrag anzeigen
    document.getElementById('modalExport').style.display = 'block';
    
    // Lösch-Button hinzufügen wenn noch nicht vorhanden
    if (!document.getElementById('deleteBtn')) {
        const deleteBtn = document.createElement('button');
        deleteBtn.id = 'deleteBtn';
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Löschen';
        deleteBtn.onclick = () => deleteEntry(entry.id);
        
        const actions = document.querySelector('.modal-actions');
        actions.insertBefore(deleteBtn, actions.firstChild);
    }
}

// Modal schließen
function closeModal() {
    const modal = document.getElementById('entryModal');
    modal.style.display = 'none';
    
    // Reset
    currentEditEntry = null;
    document.getElementById('modalExport').style.display = 'none';
    
    // Lösch-Button entfernen
    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) deleteBtn.remove();
}

// Typ-Änderung behandeln
function handleTypeChange() {
    const type = document.getElementById('entryType').value;
    const timeFields = document.getElementById('timeFields');
    const startTime = document.getElementById('startTime');
    const endTime = document.getElementById('endTime');
    
    if (type === 'vacation' || type === 'sick') {
        timeFields.style.display = 'none';
        startTime.required = false;
        endTime.required = false;
    } else {
        timeFields.style.display = 'block';
        startTime.required = true;
        endTime.required = true;
    }
}

// Form Submit
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const entryId = document.getElementById('entryId').value;
    const employee = document.getElementById('entryEmployee').value;
    const date = document.getElementById('entryDate').value;
    const type = document.getElementById('entryType').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const notes = document.getElementById('notes').value;
    
    const entryData = {
        employee,
        date,
        type,
        start_time: startTime,
        end_time: endTime,
        notes
    };
    
    try {
        if (entryId) {
            // Update
            await fetch(`tables/shifts/${entryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entryData)
            });
        } else {
            // Create
            await fetch('tables/shifts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entryData)
            });
        }
        
        // Reload und schließen
        await loadShifts();
        renderCalendar();
        closeModal();
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
        alert('Fehler beim Speichern des Eintrags. Bitte versuchen Sie es erneut.');
    }
}

// Eintrag löschen
async function deleteEntry(entryId) {
    if (!confirm('Möchten Sie diesen Eintrag wirklich löschen?')) {
        return;
    }
    
    try {
        await fetch(`tables/shifts/${entryId}`, {
            method: 'DELETE'
        });
        
        // Reload und schließen
        await loadShifts();
        renderCalendar();
        closeModal();
    } catch (error) {
        console.error('Fehler beim Löschen:', error);
        alert('Fehler beim Löschen des Eintrags. Bitte versuchen Sie es erneut.');
    }
}

// Hilfsfunktion: Prüfe ob zwei Daten gleich sind
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// ========== EXPORT FUNKTIONEN ==========

// Exportiere aktuellen Eintrag im Modal
function exportCurrentEntry() {
    if (currentEditEntry) {
        exportSingleEntry(currentEditEntry);
    }
}

// Exportiere aktuelle Woche
function exportCurrentWeek() {
    exportWeekShifts(currentWeekStart, allShifts);
    document.getElementById('exportMenu').style.display = 'none';
}

// Exportiere alle Schichten
function exportAll() {
    exportAllShifts(allShifts);
    document.getElementById('exportMenu').style.display = 'none';
}

// Zeige Mitarbeiter-Auswahlmenü
function exportEmployeeMenu() {
    const exportMenu = document.getElementById('exportMenu');
    
    // Erstelle Mitarbeiter-Untermenü
    exportMenu.innerHTML = `
        <button onclick="restoreExportMenu()"><i class="fas fa-arrow-left"></i> Zurück</button>
        <button onclick="exportEmployee('Tamara')"><i class="fas fa-user"></i> Tamara (NRW)</button>
        <button onclick="exportEmployee('Diana')"><i class="fas fa-user"></i> Diana (BW)</button>
        <button onclick="exportEmployee('Diko')"><i class="fas fa-user"></i> Diko (HB)</button>
    `;
}

// Exportiere Schichten eines Mitarbeiters
function exportEmployee(employeeName) {
    exportEmployeeShifts(employeeName, allShifts);
    restoreExportMenu();
    document.getElementById('exportMenu').style.display = 'none';
}

// Stelle ursprüngliches Export-Menü wieder her
function restoreExportMenu() {
    const exportMenu = document.getElementById('exportMenu');
    exportMenu.innerHTML = `
        <button onclick="exportCurrentWeek()"><i class="fas fa-calendar-week"></i> Diese Woche</button>
        <button onclick="exportEmployeeMenu()"><i class="fas fa-user"></i> Nach Mitarbeiter</button>
        <button onclick="exportAll()"><i class="fas fa-calendar"></i> Alle Schichten</button>
    `;
}
