/*
 */
var Roll40k = Roll40k || (function(){

    // BACK END

    /* 
        brief    Performs a basic 1D100 rolls
        param[in]   attribute       string/integer  Attribute value
        param[in]   modifier        string/integer  Bonus or malus to add to the roll
        return                      boolean         true if the roll is sucessful, false otherwise
    */
    function roll40k(attribute, modifier)
    {
        var roll = randomInteger(100);
        var Target = parseInt(attribute) + parseInt(modifier);
        return (roll <= modTarget) ? true : false;
    };

    /* 
        brief   Performs a skill roll
        param[in]   attribute       string/integer  Attribute value
        param[in]   level           integer         Level of the skill. Should be 0,1,2,3,4
        param[in]   modifier        string/integer  Bonus or malus to add to the roll
        return                      boolean         true if the roll is sucessful, false otherwise
    */
    function rollSkill40k(attribute,level,modifier)
    {
        var level_modifier = [-20,20,30,40,50];
        level = parseInt(level);
        modifier = parseInt(modifier);
        return roll40k(attribute,level_modifier[level]+modifier);
    }

    /*
        brief Rools initiative
        param[in]   agility_atr     string/integer  Agility attribute value
        return                      integer         Value of the init roll  
    */
    function rollInit40k(agility_attr)
    {
        return randomInteger(10) + floor(parseInt(agility_attr)/10);
    }

    function getSkillAttr40k(attribute)
    {

    }

    /*
    */
    function attack40k(target,weapon_attr,modifier)
    {
        var status = "missed";

        if (roll40k(weapon_attr,modifier))
        {
            var dodge_attr = getAttr40k(target,"DodgeCharacteristic");
            var dodge_level = getAttr40k(target,"DodgeCharacteristic")
            if (rollSkill40k(dodge_attr, dodge_level,modifier))
            {
                status = "hit";
            }
            else
            {
                status = "dodge";
            }
        }

        return status;
    }

    // FRONT END

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
        var cmdName = '!skill40k';


        if (msg.type === 'api' && msg.content.indexOf(cmdName) !== -1) {
            var paramArray = msg.content.slice(cmdName.length).split(',');
            if (paramArray.length !== 8) {
                sendChat(msg.who, '/w ' + msg.who + ' must specify eight comma-separated '
                    + 'parameters for the !skill40k command.'
                    + '<br>'
                    + '!skill40k [tokenName], [attributeValue], [skillBonus1], [skillBonus2], [skillBonus3], [skillBonus4], [ModifierValue]');
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
                sendChat(paramArray[0].trim(), result);
            }
        }
    });

    function createCharacBtn(token,char_symb,char_name,char_attribute) {
        var html = '';
        html = '['+char_symb+' (@{'+token+'|'+char_attribute+'})](!skill40k @{'+token+'|character_name},'+ char_name+',@{'+token+'|'+char_attribute+'},-1,0,0,0,?{Total Modifiers|0})';
        return html;  
    };

    function createCharacRow(token,char_symb,char_name,char_attribute){
        var html = '';
        html = '<tr>'
                +'<td>'
                    +createCharacBtn(token,char_symb,char_name,char_attribute)
                +'</td>'
                +'<td>'
                    +char_name
                +'</td>'
            +'</tr>'
        ;
        return html;
    };

    function createCharacTable(token) {
        var html = ''
        html = '<table>'
        + createCharacRow(token,'CC ','Capacité de Combat','WeaponSkill')
        + createCharacRow(token,'CT ','Capacité de Tir','BallisticSkill')
        + createCharacRow(token,'F  ','Force','Strength')
        + createCharacRow(token,'E  ','Endurance','Toughness')
        + createCharacRow(token,'AG ','Agilité','Agility')
        + createCharacRow(token,'INT','Intelligence','Intelligence')
        + createCharacRow(token,'PER','Perception','Perception')
        + createCharacRow(token,'FM ','Force Mentale','Willpower')
        + createCharacRow(token,'SOC','Social','Fellowship')
        + '</table>'
        return html
    };

    on('chat:message', function (msg) {
        'use strict';
        var cmdName = '!charac40k';

        if (msg.type === 'api' && msg.content.indexOf(cmdName) !== -1) {
        sendChat(msg.who, '/w '+ msg.who + createCharacTable(token),null,{noarchive:true});
        }
    });

    var lang_en = {
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
    var lang_fr = {
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
    var lang = lang_fr;

}())