// lodash for some awesome array functions
let _ = require('lodash');

// Creates a raid with the given title, time, and roster
function createRaid(title, time, roster) {
  let raid = {
    title: title,
    time: time,
    roster: roster
  }
  return raid;
}

// Prints the raid in a good format for discord
function printRaid(raid, roster) {
  let result = `RaidEvent\n${raid.title} @ ${raid.time}\n${roster.showRoster()}`;
  return result;
}

// Creates a new instance of a Roster() object
function createRoster() {
  return new Roster();
}

// Roster manages whoever is in the run
class Roster {
  constructor() {
    this.roster = {
      MainTank: '',
      OffTank: '',
      Healers: [],
      Stam: [],
      Mag: []
    }
    this.mt = ['mt', 'main tank', 'maintank', 'main'];
    this.ot = ['ot', 'off tank', 'offtank', 'off'];
    this.h = ['heal', 'heals', 'healer'];
    this.stam = ['stam', 'stam-dps'];
    this.mag = ['mag', 'mag-dps'];
  }

  // Adds someone to the run with their given role
  add(name, role) {
    role = role.toLowerCase();
    if (this.mt.includes(role)) {
      this.roster.MainTank = name;
    } else if (this.ot.includes(role)) {
      this.roster.OffTank = name;
    } else if (this.h.includes(role) && this.roster.Healers.length < 2) {
      this.roster.Healers.push(name);
    } else if (this.stam.includes(role) && this.roster.Stam.length < 4) {
      this.roster.Stam.push(name);
    } else if (this.mag.includes(role) && this.roster.Mag.length < 4) {
      this.roster.Mag.push(name);
    }
  }

  // Removes someone completely from the run
  remove(name) {
    if (name === this.roster.MainTank) {
      this.roster.MainTank = '';
    }

    if (name === this.roster.OffTank) {
      this.roster.OffTank = '';
    }

    _.remove(this.roster.Healers, (healer) => {
      return healer === name;
    });

    _.remove(this.roster.Stam, (dps) => {
      return dps === name;
    });

    _.remove(this.roster.Mag, (dps) => {
      return dps === name;
    });
  }

  // Shows the roster
  showRoster() {
    let roster = `- MainTank: ${this.roster.MainTank}\n- OffTank: ${this.roster.OffTank}`;
    let healCount = 2;
    this.roster.Healers.forEach((healer) => {
      roster += `\n- Healer: ${healer}`;
      healCount--;
    });
    while (healCount > 0) {
      roster += `\n- Healer: `;
      healCount--;
    }

    let stamCount = 4;
    this.roster.Stam.forEach((stam) => {
      roster += `\n- Stam-dps: ${stam}`;
      stamCount--;
    });
    while (stamCount > 0) {
      roster += `\n- Stam-dps: `;
      stamCount--;
    }

    let magCount = 4;
    this.roster.Mag.forEach((mag) => {
      roster += `\n- Mag-dps: ${mag}`;
      magCount--;
    });
    while (magCount > 0) {
      roster += `\n- Mag-dps: `;
      magCount--;
    }
    return roster;
  }
}

module.exports = { createRaid, createRoster, printRaid };