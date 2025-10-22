# 📅 L1 Technischer Support - Schichtplaner 2025

Ein professioneller Schichtplanungs-System für das L1 Technical Support Team mit automatischer Feiertagserkennung für verschiedene Bundesländer.

## 🎯 Projektübersicht

Dieser Schichtplaner wurde speziell für ein Support-Team mit drei Mitarbeitern entwickelt und bietet eine intuitive Wochenansicht zur Verwaltung von Schichten, Urlauben, Krankheitstagen und Überstunden für die restlichen Wochen des Jahres 2025.

## ✨ Hauptfunktionen

### Bereits implementierte Features:

✅ **Wochenbasierte Kalenderansicht**
- Übersichtliche Darstellung aller 7 Wochentage
- Navigation zwischen Wochen (Vor/Zurück)
- "Heute"-Button für schnellen Zugriff auf aktuelle Woche
- Hervorhebung des aktuellen Tages
- Anzeige von Wochennummer und Datumsbereich

✅ **Mitarbeiterverwaltung**
- Drei Mitarbeiter: Tamara Sand, Diana Tschanz/Kölhnemannn, Diko
- Bundeslandzuordnung für automatische Feiertagserkennung:
  - Tamara → Nordrhein-Westfalen (NRW)
  - Diana → Baden-Württemberg (BW)
  - Diko → Bremen (HB)

✅ **Automatische Feiertagserkennung**
- Bundeslandspezifische Feiertage für 2025
- Automatische Anzeige im Kalender
- Verschiedene Feiertage je nach Bundesland

✅ **Schicht- und Eintragstypen**
- 🧳 **Schicht**: Mit Start- und Endzeit (z.B. 7:00 - 13:00)
- 🏖️ **Urlaub**: Ganztägiger Urlaubseintrag
- 🏥 **Krankheit**: Krankmeldung
- ⏰ **Überstunden**: Mit Zeitangabe
- ⭐ **Feiertag**: Automatisch erkannt

✅ **Einträge verwalten**
- Hinzufügen von Einträgen per Klick auf "+" Button
- Bearbeiten vorhandener Einträge durch Anklicken
- Löschen von Einträgen
- Optionale Notizen für jeden Eintrag

✅ **📥 Outlook Kalender Export (NEU!)**
- Export als .ics-Datei (iCalendar-Format)
- Kompatibel mit: Outlook, Google Calendar, Apple Kalender, etc.
- Export-Optionen:
  - Einzelne Schicht exportieren
  - Ganze Woche exportieren
  - Nach Mitarbeiter exportieren
  - Alle Schichten exportieren
- Automatische Kategorisierung und Tags
- Zeitangaben und Notizen werden übernommen

✅ **Moderne Benutzeroberfläche**
- Dunkles, modernes Design
- Farbcodierte Einträge für schnelle Übersicht
- Responsive Layout für verschiedene Bildschirmgrößen
- Smooth Animationen und Hover-Effekte
- Font Awesome Icons

✅ **Datenpersistenz**
- RESTful API Integration
- Automatisches Speichern in Datenbank
- Laden aller Einträge beim Start

## 🗂️ Projekt-Struktur

```
schichtplaner/
├── index.html              # Haupt-HTML-Datei
├── css/
│   └── style.css          # Alle Styles (dark theme)
├── js/
│   ├── main.js            # Haupt-JavaScript-Logik
│   ├── holidays.js        # Feiertagsdaten und -logik
│   └── calendar-export.js # iCalendar/Outlook Export-Funktionen
└── README.md              # Diese Datei
```

## 🔧 Technische Details

### Datenbank-Schema

**Tabelle: `shifts`**
- `id` (text): Eindeutige ID
- `employee` (text): Mitarbeitername (Tamara, Diana, Diko)
- `date` (text): Datum im Format YYYY-MM-DD
- `type` (text): Eintragstyp (shift, vacation, sick, overtime, holiday)
- `start_time` (text): Startzeit (z.B. "07:00")
- `end_time` (text): Endzeit (z.B. "13:00")
- `notes` (text): Zusätzliche Notizen

### API-Endpunkte

Der Schichtplaner nutzt die RESTful Table API:

- `GET tables/shifts?limit=1000` - Alle Schichten laden
- `POST tables/shifts` - Neuen Eintrag erstellen
- `PUT tables/shifts/{id}` - Eintrag aktualisieren
- `DELETE tables/shifts/{id}` - Eintrag löschen

### Verwendete Technologien

- **HTML5** - Semantische Struktur
- **CSS3** - Modernes Styling mit Flexbox & Grid
- **JavaScript (ES6+)** - Logik und API-Integration
- **Font Awesome 6.4.0** - Icons
- **RESTful Table API** - Datenpersistenz

## 🚀 Verwendung

### Grundlegende Navigation

1. **Zwischen Wochen navigieren**: Nutze die Pfeiltasten "Vorherige Woche" / "Nächste Woche"
2. **Zu aktueller Woche springen**: Klicke auf "Heute"-Button
3. **Wocheninfo**: Oben wird Wochennummer und Datumsbereich angezeigt

### Einträge erstellen

1. Fahre mit der Maus über eine Tageszelle des gewünschten Mitarbeiters
2. Klicke auf den **"+"** Button der erscheint
3. Wähle den Eintragstyp:
   - **Schicht**: Gib Start- und Endzeit ein
   - **Urlaub**: Ganztägig, keine Zeitangabe nötig
   - **Krankheit**: Ganztägig, keine Zeitangabe nötig
   - **Überstunden**: Gib Start- und Endzeit ein
4. Optional: Füge Notizen hinzu
5. Klicke auf "Speichern"

### Einträge bearbeiten/löschen

1. Klicke auf einen vorhandenen Eintrag
2. Bearbeite die Daten im Modal-Dialog
3. Klicke auf "Speichern" zum Aktualisieren
4. Klicke auf "Löschen" zum Entfernen (mit Bestätigung)
5. **NEU**: Klicke auf "In Outlook exportieren" um diesen Eintrag als .ics zu exportieren

### 📥 Outlook Kalender Export

**Der Schichtplaner kann alle Einträge als .ics-Dateien (iCalendar-Format) exportieren!**

#### Export-Optionen:

1. **Einzelner Eintrag**: Klicke auf einen Eintrag → Im Dialog auf "In Outlook exportieren"
2. **Diese Woche**: Klicke oben auf "Export" → "Diese Woche"
3. **Nach Mitarbeiter**: Klicke auf "Export" → "Nach Mitarbeiter" → Wähle Tamara, Diana oder Diko
4. **Alle Schichten**: Klicke auf "Export" → "Alle Schichten" (kompletter Schichtplan 2025)

#### In Outlook importieren:

> 📖 **Ausführliche Anleitung**: Siehe [OUTLOOK_EXPORT_ANLEITUNG.md](OUTLOOK_EXPORT_ANLEITUNG.md) für detaillierte Schritte!

**Kurzanleitung - Outlook Desktop (Windows):**
1. Öffne Outlook
2. Gehe zu **Datei** → **Öffnen und Exportieren** → **Importieren/Exportieren**
3. Wähle **iCalendar (.ics) oder vCalendar-Datei (.vcs) importieren**
4. Wähle die heruntergeladene .ics-Datei
5. Klicke auf **OK** → Die Schichten erscheinen in deinem Kalender! 🎉

**Kurzanleitung - Outlook Web (Office 365):**
1. Gehe zu [outlook.office.com](https://outlook.office.com)
2. Klicke auf **Kalender** (unten links)
3. Klicke auf **Hinzufügen** → **Aus Datei hochladen**
4. Wähle die .ics-Datei
5. Wähle den Zielkalender
6. Klicke auf **Importieren** → Fertig! ✅

**Funktioniert auch mit:**
- ✅ Google Calendar
- ✅ Apple Kalender (Mac/iPhone/iPad)
- ✅ Thunderbird mit Lightning
- ✅ Alle anderen .ics-kompatiblen Kalender-Apps

#### Was wird exportiert?

- ✅ **Schichten**: Mit genauer Uhrzeit (z.B. 7:00 - 13:00)
- ✅ **Urlaub**: Als ganztägiges Event
- ✅ **Krankheit**: Als ganztägiges Event (Status: Abgesagt)
- ✅ **Überstunden**: Mit Zeitangabe
- ✅ **Feiertage**: Als ganztägiges Event
- ✅ **Notizen**: Im Beschreibungsfeld des Kalender-Events
- ✅ **Kategorien/Tags**: Für bessere Organisation im Kalender

### Feiertage

Feiertage werden automatisch angezeigt, wenn:
- An dem Tag ein Feiertag im jeweiligen Bundesland ist
- Noch kein anderer Eintrag für diesen Tag existiert

## 🎨 Farbcodierung (deepup Design)

Die verschiedenen Eintragstypen sind im deepup-Farbschema gekennzeichnet:

- 🔵 **Cyan** (#00ffff) - Schichten (reguläre Arbeitszeit)
- 🟠 **Gold** (#ffc800) - Urlaub
- 🔴 **Pink** (#ff3264) - Krankheit
- 🟣 **Magenta** (#ff00ff) - Überstunden
- 🟢 **Mint** (#00ff96) - Feiertage

Das komplette Design verwendet das charakteristische deepup/DAVIbot Farbschema mit Cyan-Akzenten und dunklem Hintergrund.

## 📱 Responsive Design

Der Schichtplaner ist vollständig responsive und funktioniert auf:
- 💻 Desktop (optimal ab 1200px)
- 📱 Tablets (mit horizontalem Scrollen)
- 📱 Smartphones (mit angepasstem Layout)

## 🔮 Mögliche Erweiterungen

Ideen für zukünftige Features:

- [x] **Outlook/Kalender Export** ✅ IMPLEMENTIERT!
- [ ] **Export-Funktion** (PDF, Excel)
- [ ] **Statistiken** (Arbeitsstunden pro Mitarbeiter, Urlaubstage)
- [ ] **Monatsansicht** als Alternative zur Wochenansicht
- [ ] **Druckansicht** für Papierdokumente
- [ ] **Benachrichtigungen** bei Schichtkonflikten
- [ ] **Filter** nach Eintragstyp oder Mitarbeiter
- [ ] **Kommentarfunktion** für Team-Kommunikation
- [ ] **Schichtvorlagen** für wiederkehrende Schichten
- [ ] **Tauschfunktion** für Schichten zwischen Mitarbeitern
- [ ] **Jahresübersicht** als Kalender-Grid
- [ ] **Email-Benachrichtigungen** bei neuen Schichten
- [ ] **Kalender-Synchronisation** (Live-Updates)

## 📅 Feiertage 2025

### NRW (Tamara) - 11 Feiertage
- 01.01. Neujahr
- 18.04. Karfreitag
- 21.04. Ostermontag
- 01.05. Tag der Arbeit
- 29.05. Christi Himmelfahrt
- 09.06. Pfingstmontag
- 19.06. Fronleichnam
- 03.10. Tag der Deutschen Einheit
- 01.11. Allerheiligen
- 25.12. 1. Weihnachtstag
- 26.12. 2. Weihnachtstag

### Baden-Württemberg (Diana) - 12 Feiertage
- 01.01. Neujahr
- 06.01. Heilige Drei Könige ⭐
- 18.04. Karfreitag
- 21.04. Ostermontag
- 01.05. Tag der Arbeit
- 29.05. Christi Himmelfahrt
- 09.06. Pfingstmontag
- 19.06. Fronleichnam
- 03.10. Tag der Deutschen Einheit
- 01.11. Allerheiligen
- 25.12. 1. Weihnachtstag
- 26.12. 2. Weihnachtstag

### Bremen (Diko) - 10 Feiertage
- 01.01. Neujahr
- 18.04. Karfreitag
- 21.04. Ostermontag
- 01.05. Tag der Arbeit
- 29.05. Christi Himmelfahrt
- 09.06. Pfingstmontag
- 03.10. Tag der Deutschen Einheit
- 31.10. Reformationstag ⭐
- 25.12. 1. Weihnachtstag
- 26.12. 2. Weihnachtstag

⭐ = Bundeslandspezifischer Feiertag

## 🛠️ Entwicklung

### Lokale Anpassungen

**Mitarbeiternamen ändern**: Bearbeite in `js/main.js`:
```javascript
const employees = ['Tamara', 'Diana', 'Diko'];
```

**Bundesländer ändern**: Bearbeite in `js/holidays.js`:
```javascript
const employeeStates = {
    'Tamara': 'NRW',
    'Diana': 'BW',
    'Diko': 'HB'
};
```

**Feiertage anpassen**: Bearbeite in `js/holidays.js` das `holidays2025` Objekt

**Farben ändern**: Bearbeite in `css/style.css` die entsprechenden `.entry.{type}` Klassen

## 📄 Lizenz

Dieses Projekt wurde für den internen Gebrauch im L1 Technical Support Team erstellt.

## 🙋 Support

Bei Fragen oder Problemen kontaktiere bitte das Entwicklerteam.

---

**Version**: 1.0.0  
**Erstellt**: Oktober 2025  
**Für**: L1 Technischer Support Team  
**Gültig für**: Restliche Wochen 2025
