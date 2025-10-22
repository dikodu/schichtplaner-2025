// Feiertage 2025 für NRW, Baden-Württemberg und Bremen
// Quelle: Offizielle Feiertagskalender Deutschland

const holidays2025 = {
    // NRW (Nordrhein-Westfalen) - für Tamara
    NRW: {
        '2025-01-01': 'Neujahr',
        '2025-04-18': 'Karfreitag',
        '2025-04-21': 'Ostermontag',
        '2025-05-01': 'Tag der Arbeit',
        '2025-05-29': 'Christi Himmelfahrt',
        '2025-06-09': 'Pfingstmontag',
        '2025-06-19': 'Fronleichnam',
        '2025-10-03': 'Tag der Deutschen Einheit',
        '2025-11-01': 'Allerheiligen',
        '2025-12-25': '1. Weihnachtstag',
        '2025-12-26': '2. Weihnachtstag'
    },
    
    // Baden-Württemberg (BW) - für Diana
    BW: {
        '2025-01-01': 'Neujahr',
        '2025-01-06': 'Heilige Drei Könige',
        '2025-04-18': 'Karfreitag',
        '2025-04-21': 'Ostermontag',
        '2025-05-01': 'Tag der Arbeit',
        '2025-05-29': 'Christi Himmelfahrt',
        '2025-06-09': 'Pfingstmontag',
        '2025-06-19': 'Fronleichnam',
        '2025-10-03': 'Tag der Deutschen Einheit',
        '2025-11-01': 'Allerheiligen',
        '2025-12-25': '1. Weihnachtstag',
        '2025-12-26': '2. Weihnachtstag'
    },
    
    // Bremen (HB) - für Diko
    HB: {
        '2025-01-01': 'Neujahr',
        '2025-04-18': 'Karfreitag',
        '2025-04-21': 'Ostermontag',
        '2025-05-01': 'Tag der Arbeit',
        '2025-05-29': 'Christi Himmelfahrt',
        '2025-06-09': 'Pfingstmontag',
        '2025-10-03': 'Tag der Deutschen Einheit',
        '2025-10-31': 'Reformationstag',
        '2025-12-25': '1. Weihnachtstag',
        '2025-12-26': '2. Weihnachtstag'
    }
};

// Funktion prüft ob ein bestimmtes Datum für einen Mitarbeiter ein Feiertag ist
function isHoliday(date, state) {
    const dateStr = date.toISOString().split('T')[0];
    return holidays2025[state] && holidays2025[state][dateStr] ? holidays2025[state][dateStr] : null;
}

// Mitarbeiter zu Bundesland zuordnen
const employeeStates = {
    'Tamara': 'NRW',
    'Diana': 'BW',
    'Diko': 'HB'
};

// Hole Feiertag für einen Mitarbeiter
function getHolidayForEmployee(date, employeeName) {
    const state = employeeStates[employeeName];
    if (!state) return null;
    return isHoliday(date, state);
}
