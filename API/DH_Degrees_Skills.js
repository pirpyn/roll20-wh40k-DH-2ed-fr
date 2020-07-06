/**
 * This script rolls a d100 and computes and outputs the success results based
 * on Dark Heresy Second Edition RPG criteria. It is intended to be used for skill
 * checks.
 *
 * The following commands is used:
 * !skill40k [speaker_name], [attribute-name-u], [attributeValue], [skillBonus], [ModifierValue]
 *
 * It is expected that the following bonus are included based on the skill level of the character:
 * skillBonus1 = 10 or 0, if known
 * skillBonus2 = 10 or 0, if trained or less than trained
 * skillBonus3 = 10 or 0, if experienced or less than experienced
 * skillBonus4 = 10 or 0, if veteran or less than veteran
 *
 * Example:
 * !skill40k @{character_name},agility-u,@{Agility}${modAgility},?{Total Modifiers|0}
 *
 * This script was written by Jack D on Roll20 Forums at https://app.roll20.net/forum/post/4607859/help-dark-heresy-2nd-edition-api
 *
 * It was modified by Pierre P
 *
 **/

var lang = {
"weaponskill-u": "Capacité de Combat",
"ws-u": "CC",
"ballisticskill-u": "Capacité de Tir",
"bs-u": "CT",
"strength-u": "Force",
"s-u": "F",
"toughness-u": "Endurance",
"t-u": "E",
"agility-u": "Agilité",
"ag-u": "Ag",
"intelligence-u": "Intelligence",
"int-u": "Int",
"perception-u": "Perception",
"per-u": "Per",
"willpower-u": "Force Mentale",
"wp-u": "FM",
"fellowship-u": "Sociabilité",
"fel-u": "Soc",
"acrobatics-u": "Acrobatie",
"athletics-u": "Athlétisme",
"awareness-u": "Vigilance",
"charm-u": "Charisme",
"command-u": "Commandement",
"commerce-u": "Commerce",
"deceive-u": "Duperie",
"dodge-u": "Esquive",
"inquiry-u": "Enquête",
"interrogation-u": "Interrogatoire",
"intimidate-u": "Intimidation",
"logic-u": "Logique",
"medicae-u": "Medicae",
"navigate-u": "Navigation",
"surface-u": "Surface",
"stellar-u": "Stellaire",
"warp-u": "Warp",
"operate-u": "Conduire",
"aeronautica-u": "Aeronefs",
"voidship-u": "Vaisseaux spatiaux",
"parry-u": "Parade",
"psyniscience-u": "Psyniscience",
"scrutiny-u": "Surveillance",
"security-u": "Sécurité",
"sleight-of-hand-u": "Escamotage",
"stealth-u": "Discrétion",
"survival-u": "Survie",
"tech-use-u": "Technomaîtrise",
"linguistics-u": "Linguistique",
"trade-u": "Commerce",
"lore-u": "Connaissance",
"common-u": "Commun",
"scholastic-u": "Scolastique",
"forbidden-u": "Interdite",
"Rolling-u": "Jet de",
"Rolled-a-u": "Obtient",
"Suceeds-by-u": "Réussite de",
"Fails-by-u": "Echec de",
"degree-u": "degré(s)",
"Epic-sucess-u" : "Réussite critique !",
"Fumble-u" : "Echec critique !"
};


//Rolls a d100 and calculates the success or fail results to the chat window.
var rollResultForSkill40k = function (skill_name, skill_value, skill_modifier_value, modifier) {
    var roll = randomInteger(100);
    var modTarget = parseInt(skill_value) + parseInt(modifier) + parseInt(skill_modifier_value);
    var msg = '';
    var roll_info = '';
    var roll_result = '';
    var degOfSuc = 0;

    roll_info = lang["Rolling-u"] + ' ' + lang[skill_name];
    
    roll_info += ` <B> ${modTarget} (${skill_value} + ${skill_modifier_value} + ${modifier}).</B>` + 
    ' ' + lang["Rolled-a-u"] + ' <B>' + roll + '.</B>';

    //Form output message based on result
    if (roll === 1) {
        roll_result = '<span style="color:orange">';
        msg += '<B>' + lang["Epic-sucess-u"] + '</B>';
    }
    else if (roll === 100) {
        roll_result = '<span style="color:black">';
        msg += '<B>' + lang["Fumble-u"] + '</B>';
    }
    else if (roll <= modTarget) {
        degOfSuc = (Math.floor(modTarget / 10) - Math.floor(roll / 10)) + 1;
        roll_result = '<span style="color:green">';
        msg += lang["Suceeds-by-u"] + ' <B>' + degOfSuc + ' ' + lang["degree-u"] + '.</B>';
    }
    else {
        degOfSuc = (Math.floor(roll / 10) - Math.floor(modTarget / 10)) + 1;
        roll_result = '<span style="color:red">';
        msg += lang["Fails-by-u"] + ' <B>' + degOfSuc + ' ' + lang["degree-u"] + '.</B>';
    }

    roll_result += msg + '</span>';

    //Return output
    return roll_info + '<br><br>' + roll_result;
};


/** Interpret the chat commands. **/
on('chat:message', function (msg) {
    'use strict';
    var cmdName = '!skill40k ';


    if (msg.type === 'api' && msg.content.indexOf(cmdName) !== -1) {
        var paramArray = msg.content.slice(cmdName.length).split(',');
        if (paramArray.length !== 5) {
            sendChat(msg.who, '/w ' + msg.who + ' must specify 5 comma-separated ' +
                'parameters for the !skill40k command.');
        }
        else {
            var result = rollResultForSkill40k(
                paramArray[1].trim(),
                paramArray[2].trim(),
                paramArray[3].trim(),
                paramArray[4].trim()
            );
            log(`rollResultForSkill40k(${paramArray[1].trim()},${paramArray[2].trim()},${paramArray[3].trim()},${paramArray[4].trim()})`);
            sendChat(paramArray[0].trim(), result);
            log(`sendChat(${msg.who},${result})`);
        }
    }
});