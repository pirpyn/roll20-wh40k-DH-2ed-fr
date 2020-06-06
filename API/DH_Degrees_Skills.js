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
    "Rolling": "Rolling",
    "is-untrained" : "is untrained",
    "is-known": "is known",
    "is-trained": "is trained",
    "is-experienced": "is experienced",
    "is-mastered": "is mastered",
    "granting-a-modified-target-of": "granting a modified target of",
    "Rolled-a": "Rolled a",
    "Suceeds-by": "succeeds by",
    "Fails-by": "fails by",
    "degree": "degree(s)",
    "Epic-sucess": "Epic sucess!",
    "Fumble": "Fumble ! ",
};
var fr = {
    "Rolling": "Jet de",
    "is-untrained" : "n'est pas formé",
    "is-known": "est appris",
    "is-trained": "est entrainé",
    "is-experienced": "est expérimenté",
    "is-mastered": "est maitrisé",
    "granting-a-modified-target-of": "se compare donc à",
    "Rolled-a": "Il fait",
    "Suceeds-by": "Réussite de",
    "Fails-by": "Echec de",
    "degree": "degré(s)",
    "Epic-sucess" : "Réussite critique !",
    "Fumble" : "Echec critique !",
};

var lang = fr;

//Rolls a d100 and calculates the success or fail results to the chat window.
var rollResultForSkill40k = function (attribute_name, attribute, skillBn1, skillBn2, skillBn3, skillBn4, modifier) {
    var roll = randomInteger(100);
    var skillBonus = parseInt(skillBn1) + parseInt(skillBn2) + parseInt(skillBn3) + parseInt(skillBn4) - 20;
    var modTarget = parseInt(attribute) + parseInt(modifier);
    var roll_info = "";
    var msg = "";
    var roll_result = "";
    var degOfSuc = 0;


    roll_info = lang["Rolling"] + ' ' + attribute_name;

    //Create output which includes skill level wording
    switch (skillBonus) {
    case 0:
        roll_info += ' ' + lang["is-known"]+ ' ' + lang["granting-a-modified-target-of"];
        break;
    case 10:
        roll_info += ' ' + lang["is-trained"]+ ' ' + lang["granting-a-modified-target-of"];
        break;
    case 20:
        roll_info += ' ' + lang["is-experience"]+ ' ' + lang["granting-a-modified-target-of"];
        break;
    case 30:
        roll_info += ' ' + lang["is-mastered"]+ ' ' + lang["granting-a-modified-target-of"];
        break;
    case -20:
        roll_info += ' ' + lang["is-untrained"] + ' ' + lang["granting-a-modified-target-of"];
        break;
    default:
        // Characteristics don't have skill bonuses
        // so by setings the Bonuses to something different from 10,
        // we fall here, like -1 for Bn1, 0 for the other
        skillBonus = 0;
        roll_info += '';
        break;
    }
    
    modTarget += skillBonus;
    
    roll_info += ` <B> ${modTarget} (${attribute} + ${skillBonus} + ${modifier}).</B>` + 
    ' ' + lang["Rolled-a"] + ' <B>' + roll + '.</B>';

    //Form output message based on result
    if (roll === 1) {
        roll_result = '<span style="color:orange">';
        msg += '<B>' + lang["Epic-sucess"] + '</B>';
    }
    else if (roll === 100) {
        roll_result = '<span style="color:black">';
        msg += '<B>' + lang["Fumble"] + '</B>';
    }
    else if (roll <= modTarget) {
        degOfSuc = (Math.floor(modTarget / 10) - Math.floor(roll / 10)) + 1;
        roll_result = '<span style="color:green">';
        msg += lang["Suceeds-by"] + ' <B>' + degOfSuc + ' ' + lang["degree"] + '.</B>';
    }
    else {
        degOfSuc = (Math.floor(roll / 10) - Math.floor(modTarget / 10)) + 1;
        roll_result = '<span style="color:red">';
        msg += lang["Fails-by"] + ' <B>' + degOfSuc + ' ' + lang["degree"] + '.</B>';
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
        if (paramArray.length !== 8) {
            sendChat(msg.who, '/w ' + msg.who + ' must specify eight comma-separated ' +
                'parameters for the !skill40k command.');
        }
        else {
            var result = rollResultForSkill40k(
                paramArray[1].trim(),
                paramArray[2].trim(),
                paramArray[3].trim(),
                paramArray[4].trim(),
                paramArray[5].trim(),
                paramArray[6].trim(),
                paramArray[7].trim()
            );
            //log(`rollResultForSkill40k(${paramArray[0].trim()},${paramArray[1].trim()},${paramArray[2].trim()},${paramArray[3].trim()},${paramArray[4].trim()},${paramArray[5].trim()},${paramArray[6].trim()})`);
            sendChat(paramArray[0].trim(), result);
            //log(`sendChat(${msg.who},${result})`);
        }
    }
});

on('chat:message', function (msg) {
    'use strict';
    var cmdName = '!charac40k';

    function createBtnForCharac (char_symb,char_name,char_attribute) {
        var token = msg.who;
        var html = '';
        html = 
            '<tr>'
                +'<td>'
                    +'['+char_symb+']'
                    +'(!skill40k @{'+token+'|character_name},'+ char_name+',@{'+token+'|'+char_attribute+'},-1,0,0,0,?{Total Modifiers|0})' 
                +'</td>'
                +'<td>'
                    +char_name
                +'</td>'
            +'</tr>'
        ;
        return html;  
    };


    if (msg.type === 'api' && msg.content.indexOf(cmdName) !== -1) {
    sendChat(msg.who,
        '/w '+ msg.who + ' <table>'
        + createBtnForCharac('CC ','Capacité de Combat','WeaponSkill')
        + createBtnForCharac('CT ','Capacité de Tir','BallisticSkill')
        + createBtnForCharac('F  ','Force','Strength')
        + createBtnForCharac('E  ','Endurance','Toughness')
        + createBtnForCharac('AG ','Agilité','Agility')
        + createBtnForCharac('INT','Intelligence','Intelligence')
        + createBtnForCharac('PER','Perception','Perception')
        + createBtnForCharac('FM ','Force Mentale','Willpower')
        + createBtnForCharac('SOC','Social','Fellowship')
        ,
        null,
        {noarchive:true}
    );
    }
});
