const base64 = require('base-64');
const client = require('./client');

const eso_sets_auth = process.env.eso_sets_token || require('../auth.json').eso_sets_token;

// Sets
const eso_sets_api_base_url = 'https://beast.pathfindermediagroup.com/api/eso/sets';
const eso_sets_base_url = 'https://eso-sets.com/set';

// Skills
const eso_skills_api_base_url = 'https://beast.pathfindermediagroup.com/api/eso/skills';
const eso_skills_base_url = 'https://eso-skillbook.com/skill';
const eso_skills_image_base_url = 'https://beast.pathfindermediagroup.com/storage/skills';

// Pledges
const eso_pledges_api_base_url = 'https://beast.pathfindermediagroup.com/api/eso/pledges';

/**
 * Downloads all the eso sets as a json file called eso_sets.json
 */
async function downloadSets() {
  try {
    let options = {
      'method': 'GET',
      'headers': {
        'Authorization': `Basic ${base64.encode(eso_sets_auth)}`
      }
    };
    let success = await client.saveJson(eso_sets_api_base_url, 'eso_sets.json', options);
    if (success) {
      console.log('Completed!');
    } else {
      console.log('Unsuccessful');
    }
  } catch (err) {
    console.log(`Error with <EsoSets.DownloadSets()>: ${err}`);
  }
}

/**
 * Gets a set from eso-sets
 * 
 * @param {String} setName - name of set
 * 
 * Returns a json representation of a set
 */
async function getSetByName(setName) {
  try {
    let options = {
      'method': 'GET',
      'headers': {
        'Authorization': `Basic ${base64.encode(eso_sets_auth)}`
      }
    };
    let url = `${eso_sets_api_base_url}/search?query=${setName}`;
    let res = await client.get(url, options);
    let set = null;
    if (res.status === 200) {
      set = await res.json();
    }
    if (set) {
      set.forEach((s) => {
        s['url'] = `${eso_sets_base_url}/${s.slug}`
      });
    }
    return set;
  } catch (err) {
    console.log(`Error with <EsoSets.GetSetByName(${setName})>: ${err}`);
    return null;
  }
}

/**
 * Gets a set from eso-sets
 * 
 * @param {Int} id - id of set
 * 
 * Returns a json representation of a set
 */
async function getSetById(id) {
  try {
    if (!Number(id)) {
      console.log(`<EsoSets.GetSetById(${id})>: ${id} is not a number`);
    }
    let options = {
      'method': 'GET',
      'headers': {
        'Authorization': `Basic ${base64.encode(eso_sets_auth)}`
      }
    };
    let url = `${eso_sets_api_base_url}/${id}`;
    let res = await client.get(url, options);
    let set = null;
    if (res.status === 200) {
      set = await res.json();
    }
    if (set) {
      set['url'] = `${eso_sets_base_url}/${set.slug}`
    }
    return set;
  } catch (err) {
    console.log(`Error with <EsoSets.GetSetById(${id})>: ${err}`);
    return null;
  }
}

const abilityTypes = {
  1: 'Active',
  2: 'Passive',
  3: 'Ultimate'
}

/**
 * Gets a set from eso-skills
 * 
 * @param {String} skillName - name of skill
 * 
 * Returns a json representation of a skill
 */
async function getSkillByName(skillName) {
  try {
    let options = {
      'method': 'GET',
      'headers': {
        'Authorization': `Basic ${base64.encode(eso_sets_auth)}`
      }
    };
    let url = `${eso_skills_api_base_url}/search?query=${skillName}`;
    let res = await client.get(url, options);
    let skill = null;
    if (res.status === 200) {
      skill = await res.json();
    }
    if (skill) {
      skill.forEach((s) => {
        s['url'] = `${eso_skills_base_url}/${s.slug}`;
        s['iconUrl'] = `${eso_skills_image_base_url}/${s.icon}`;
        s['typeString'] = abilityTypes[s.type];
      });
    }
    return skill;
  } catch (err) {
    console.log(`Error with <EsoSkills.GetSkillByName(${skillName})>: ${err}`);
    return null;
  }
}

/**
 * Gets a set from eso-skills
 * 
 * @param {Int} id - id of skill
 * 
 * Returns a json representation of a skill
 */
async function getSkillById(id) {
  try {
    if (!Number(id)) {
      console.log(`<EsoSkills.GetSkillById(${id})>: ${id} is not a number`);
    }
    let options = {
      'method': 'GET',
      'headers': {
        'Authorization': `Basic ${base64.encode(eso_sets_auth)}`
      }
    };
    let url = `${eso_skills_api_base_url}/${id}`;
    let res = await client.get(url, options);
    let skill = null;
    if (res.status === 200) {
      skill = await res.json();
    }
    if (skill) {
      skill['url'] = `${eso_skills_base_url}/${skill.slug}`;
      skill['iconUrl'] = `${eso_skills_image_base_url}/${skill.icon}`;
      skill['typeString'] = abilityTypes[skill.type];
    }
    return skill;
  } catch (err) {
    console.log(`Error with <EsoSkills.GetSkillById(${id})>: ${err}`);
    return null;
  }
}

/**
 * Gets the daily pledges for ESO.
 * 
 * @returns {Object} json object
 */
async function getPledges() {
  let options = {
    'method': 'GET',
    'headers': {
      'Authorization': `Basic ${base64.encode(eso_sets_auth)}`
    }
  };
  let url = `${eso_pledges_api_base_url}`;
  let json = await client.get(url, options);
  if (json) { 
    let pledges = await json.json();
    return pledges.en;
  } else {
    console.log('Error in getPledges');
    return null;
  }
  
}

module.exports = {
  getSetByName,
  getSetById,
  getSkillByName,
  getSkillById,
  getPledges
}