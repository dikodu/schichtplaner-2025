// Kalender Export Funktionalität für Outlook, Google Calendar, etc.
// Erstellt .ics Dateien im iCalendar-Format (RFC 5545)

// Hilfsfunktion: Formatiere Datum für ICS (YYYYMMDDTHHMMSS)
function formatICSDate(dateStr, timeStr = '00:00') {
    const [year, month, day] = dateStr.split('-');
    const [hours, minutes] = timeStr.split(':');
    return `${year}${month}${day}T${hours.padStart(2, '0')}${minutes.padStart(2, '0')}00`;
}

// Hilfsfunktion: Aktuelles Datum/Zeit als ICS Timestamp
function getICSTimestamp() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

// Erstelle ICS-Inhalt für einen einzelnen Eintrag
function createICSEvent(entry) {
    const typeLabels = {
        'shift': 'Schicht',
        'vacation': 'Urlaub',
        'sick': 'Krankheit',
        'overtime': 'Überstunden',
        'holiday': 'Feiertag'
    };
    
    const typeEmojis = {
        'shift': '💼',
        'vacation': '🏖️',
        'sick': '🏥',
        'overtime': '⏰',
        'holiday': '⭐'
    };
    
    const typeLabel = typeLabels[entry.type] || entry.type;
    const emoji = typeEmojis[entry.type] || '';
    
    // Titel des Events
    const summary = `${emoji} ${entry.employee} - ${typeLabel}`;
    
    // Beschreibung
    let description = `Mitarbeiter: ${entry.employee}\\nTyp: ${typeLabel}`;
    if (entry.start_time && entry.end_time) {
        description += `\\nZeit: ${entry.start_time} - ${entry.end_time}`;
    }
    if (entry.notes) {
        description += `\\n\\nNotizen: ${entry.notes}`;
    }
    description += `\\n\\nErstellt mit L1 Schichtplaner`;
    
    // Start- und Endzeit bestimmen
    let dtstart, dtend;
    
    if (entry.start_time && entry.end_time) {
        // Schicht oder Überstunden mit Zeitangabe
        dtstart = formatICSDate(entry.date, entry.start_time);
        dtend = formatICSDate(entry.date, entry.end_time);
    } else {
        // Ganztägiges Event (Urlaub, Krankheit, Feiertag)
        const [year, month, day] = entry.date.split('-');
        dtstart = `${year}${month}${day}`;
        
        // Endtag ist der nächste Tag (ganztägige Events gehen bis Mitternacht des nächsten Tages)
        const nextDay = new Date(entry.date);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextYear = nextDay.getFullYear();
        const nextMonth = String(nextDay.getMonth() + 1).padStart(2, '0');
        const nextDayNum = String(nextDay.getDate()).padStart(2, '0');
        dtend = `${nextYear}${nextMonth}${nextDayNum}`;
    }
    
    // Eindeutige ID generieren
    const uid = `shift-${entry.id}@schichtplaner.local`;
    
    // ICS Event erstellen
    let icsEvent = 'BEGIN:VEVENT\r\n';
    icsEvent += `UID:${uid}\r\n`;
    icsEvent += `DTSTAMP:${getICSTimestamp()}\r\n`;
    
    if (entry.start_time && entry.end_time) {
        icsEvent += `DTSTART:${dtstart}\r\n`;
        icsEvent += `DTEND:${dtend}\r\n`;
    } else {
        icsEvent += `DTSTART;VALUE=DATE:${dtstart}\r\n`;
        icsEvent += `DTEND;VALUE=DATE:${dtend}\r\n`;
    }
    
    icsEvent += `SUMMARY:${summary}\r\n`;
    icsEvent += `DESCRIPTION:${description}\r\n`;
    icsEvent += `LOCATION:L1 Technischer Support\r\n`;
    
    // Kategorien/Tags für bessere Organisation
    const categories = {
        'shift': 'WORK,SHIFT',
        'vacation': 'VACATION,PERSONAL',
        'sick': 'SICK,PERSONAL',
        'overtime': 'WORK,OVERTIME',
        'holiday': 'HOLIDAY,PERSONAL'
    };
    icsEvent += `CATEGORIES:${categories[entry.type] || 'WORK'}\r\n`;
    
    // Status
    const status = entry.type === 'sick' ? 'CANCELLED' : 'CONFIRMED';
    icsEvent += `STATUS:${status}\r\n`;
    
    // Transparenz (zeigt ob Zeit als "beschäftigt" markiert werden soll)
    const transp = (entry.type === 'vacation' || entry.type === 'sick') ? 'TRANSPARENT' : 'OPAQUE';
    icsEvent += `TRANSP:${transp}\r\n`;
    
    icsEvent += 'END:VEVENT\r\n';
    
    return icsEvent;
}

// Erstelle komplette ICS-Datei
function createICSFile(entries) {
    let icsContent = 'BEGIN:VCALENDAR\r\n';
    icsContent += 'VERSION:2.0\r\n';
    icsContent += 'PRODID:-//L1 Schichtplaner//DE\r\n';
    icsContent += 'CALSCALE:GREGORIAN\r\n';
    icsContent += 'METHOD:PUBLISH\r\n';
    icsContent += 'X-WR-CALNAME:L1 Schichtplan\r\n';
    icsContent += 'X-WR-TIMEZONE:Europe/Berlin\r\n';
    icsContent += 'X-WR-CALDESC:Schichtplan für L1 Technischer Support\r\n';
    
    // Füge alle Events hinzu
    entries.forEach(entry => {
        icsContent += createICSEvent(entry);
    });
    
    icsContent += 'END:VCALENDAR\r\n';
    
    return icsContent;
}

// Download ICS-Datei
function downloadICS(icsContent, filename) {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// Exportiere einen einzelnen Eintrag
function exportSingleEntry(entry) {
    const icsContent = createICSFile([entry]);
    const filename = `schicht-${entry.employee}-${entry.date}.ics`;
    downloadICS(icsContent, filename);
}

// Exportiere alle Schichten eines Mitarbeiters
function exportEmployeeShifts(employee, shifts) {
    const employeeShifts = shifts.filter(shift => shift.employee === employee);
    if (employeeShifts.length === 0) {
        alert(`Keine Einträge für ${employee} gefunden.`);
        return;
    }
    const icsContent = createICSFile(employeeShifts);
    const filename = `schichtplan-${employee}-2025.ics`;
    downloadICS(icsContent, filename);
}

// Exportiere alle Schichten einer bestimmten Woche
function exportWeekShifts(weekStart, shifts) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    const weekShifts = shifts.filter(shift => {
        const shiftDate = new Date(shift.date);
        return shiftDate >= weekStart && shiftDate < weekEnd;
    });
    
    if (weekShifts.length === 0) {
        alert('Keine Einträge für diese Woche gefunden.');
        return;
    }
    
    const weekNumber = getWeekNumber(weekStart);
    const icsContent = createICSFile(weekShifts);
    const filename = `schichtplan-woche${weekNumber}-2025.ics`;
    downloadICS(icsContent, filename);
}

// Exportiere alle Schichten (gesamter Schichtplan)
function exportAllShifts(shifts) {
    if (shifts.length === 0) {
        alert('Keine Einträge zum Exportieren vorhanden.');
        return;
    }
    const icsContent = createICSFile(shifts);
    const filename = `schichtplan-gesamt-2025.ics`;
    downloadICS(icsContent, filename);
}

// Exportiere Schichten für einen Datumsbereich
function exportDateRangeShifts(startDate, endDate, shifts) {
    const rangeShifts = shifts.filter(shift => {
        const shiftDate = new Date(shift.date);
        return shiftDate >= startDate && shiftDate <= endDate;
    });
    
    if (rangeShifts.length === 0) {
        alert('Keine Einträge für diesen Zeitraum gefunden.');
        return;
    }
    
    const icsContent = createICSFile(rangeShifts);
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];
    const filename = `schichtplan-${startStr}-bis-${endStr}.ics`;
    downloadICS(icsContent, filename);
}
