let base64 = require('base-64');
let client = require('../services/client');

const eso_skills_api_base_url = 'https://beast.pathfindermediagroup.com/api/eso/skills';
const eso_skills_base_url = 'https://eso-skillbook.com/skill';
const eso_skills_image_base_url = 'https://beast.pathfindermediagroup.com/storage/skills';
const eso_sets_auth = process.env.eso_sets_token || require('../auth.json').eso_sets_token;

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
async function GetSkillByName(skillName) {
  try {
    let options = {
      'method': 'GET',
      'headers': {
        'Authorization': `Basic ${base64.encode(eso_sets_auth)}`
      }
    };
    let url = `${eso_skills_api_base_url}/search?query=${skillName}`;
    let skill = await client.GetAsync(url, options);
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
async function GetSkillById(id) {
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
    let skill = await client.GetAsync(url, options);
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

// async function test() {
//   let res = await GetSkillByName('death knell');
//   console.log(res);
// }

// test();

module.exports = {
  GetSkillByName: GetSkillByName,
  GetSkillById: GetSkillById
}