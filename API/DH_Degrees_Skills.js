/**
 * This script rolls a d100 and computes and outputs the success results based
 * on Dark Heresy Second Edition RPG criteria. It is intended to be used for skill
 * checks.
 *
 * The following commands is used:
 * !skill40k [tokenName], [attributeValue], [skillBonus1], [skillBonus2], [skillBonus3], [skillBonus4], [ModifierValue]
 *
 * It is expected that the following bonus are included based on the skill level of the character:
 * skillBonus1 = 20 or 0, if known or untrained
 * skillBonus2 = 10 or 0, if trained or less than trained
 * skillBonus3 = 10 or 0, if experienced or less than experienced
 * skillBonus4 = 10 or 0, if veteran or less than veteran
 *
 * Example:
 * /em @{character_name} makes a known Acrobatics skill check!
 * !skill40k @{character_name} Acrobatic Skill,@{Agility},20,0,0,0,?{Total Modifiers|0}
 *
 * This script was written by Jack D on Roll20 Forums at https://app.roll20.net/forum/post/4607859/help-dark-heresy-2nd-edition-api
 *
 **/
var en = {
    "is-untrained" : "is untrained",
    "is-known": "is known",
    "is-trained": "is trained",
    "is-experienced": "is experienced",
    "is-mastered": "is mastered",
    "granting-a-modified-target-of": "granting a modified target of",
    "They-rolled-a": "They rolled a"
};
var fr = {
    "is-untrained" : "n'est pas formé",
    "is-known": "est appris",
    "is-trained": "est entrainé",
    "is-experienced": "est expérimenté",
    "is-mastered": "est maitrisé",
    "granting-a-modified-target-of": "modifiant le jet adverse à",
    "They-rolled-a": "Il fait",
};

var lang = fr;

//Rolls a d100 and calculates the success or fail results to the chat window.
var rollResultForSkill40k = function (token, attribute, skillBn1, skillBn2, skillBn3, skillBn4, modifier) {
	var roll = randomInteger(100);
	var skillBonus = parseInt(skillBn1) + parseInt(skillBn2) + parseInt(skillBn3) + parseInt(skillBn4) - 20;
	var modTarget = parseInt(attribute) + skillBonus + parseInt(modifier);
	var output1 = token, msg = '',
		output2, sucess, degOfSuc;


	//Create output which includes skill level wording
	switch (skillBonus) {
	case 0:
		output1 += ' ' + lang["is-known"];
		break;
	case 10:
		output1 += ' ' + lang["is-trained"];
		break;
	case 20:
		output1 += ' ' + lang["is-experience"];
		break;
	case 30:
		output1 += ' ' + lang["is-mastered"];
		break;
	default:
		output1 += ' ' + lang["is-untrained"];
	}
	output1 += ' ' + lang["modified-target"]+ '<B>' + modTarget + '</B>' + 
	' ' + lang["They-rolled-a"] + ' <B>' + roll + '</B>.';


	//Form output message based on result
	if (roll === 1) {
	    sucess = true;
		msg += ' suceeds by <B>1 degree</B>.';
	}
	else if (roll === 100) {
	    sucess = false;
		msg += ' fails by <B>1 degree</B>.';
	}
	else if (roll <= modTarget) {
	    sucess = true;
		degOfSuc = (Math.floor(modTarget / 10) - Math.floor(roll / 10)) + 1;
		msg += ' succeeds by <B>' + degOfSuc + ' degree(s)</B>.';
	}
	else {
	    sucess = false;
		degOfSuc = (Math.floor(roll / 10) - Math.floor(modTarget / 10)) + 1;
		msg += ' fails by <B>' + degOfSuc + ' degree(s)</B>.';
	}
	
	if (sucess) {
	  output2 = '<span style="color:green">';
	}
	else {
	  output2 = '<span style="color:red">';
	}
	
    output2 += msg+'</span>';

	//Return output
	return token + ' <br><br>' + output1 + '<br><br>' + output2;
};


/** Interpret the chat commands. **/
on('chat:message', function (msg) {
	'use strict';
	var cmdName = '!skill40k ';


	if (msg.type === 'api' && msg.content.indexOf(cmdName) !== -1) {
		var paramArray = msg.content.slice(cmdName.length).split(',');
		if (paramArray.length !== 7) {
			sendChat(msg.who, '/w ' + msg.who + ' must specify seven comma-separated ' +
				'parameters for the !skill40k command.');
		}
		else {
			var result = rollResultForSkill40k(paramArray[0].trim(),
				paramArray[1].trim(),
				paramArray[2].trim(),
				paramArray[3].trim(),
				paramArray[4].trim(),
				paramArray[5].trim(),
				paramArray[6].trim()
			);
            log(`rollResultForSkill40k(${paramArray[0].trim()},${paramArray[1].trim()},${paramArray[2].trim()},${paramArray[3].trim()},${paramArray[4].trim()},${paramArray[5].trim()},${paramArray[6].trim()})`);
			sendChat(msg.who, result);
			log(`sendChat(${msg.who},${result})`);
		}
	}
});