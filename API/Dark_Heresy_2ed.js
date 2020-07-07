/*
 */
var Roll40k = Roll40k || (function(){

//    // BACK END
//
//    /* 
//        brief    Performs a basic 1D100 rolls
//        param[in]   attribute       string/integer  Attribute value
//        param[in]   modifier        string/integer  Bonus or malus to add to the roll
//        return                      boolean         true if the roll is sucessful, false otherwise
//    */
//    function roll40k(attribute, modifier)
//    {
//        var roll = randomInteger(100);
//        var Target = parseInt(attribute) + parseInt(modifier);
//        return (roll <= Target) ? true : false;
//    };
//
//    /* 
//        brief   Performs a skill roll
//        param[in]   attribute       string/integer  Attribute value
//        param[in]   level           integer         Level of the skill. Should be 0,1,2,3,4
//        param[in]   modifier        string/integer  Bonus or malus to add to the roll
//        return                      boolean         true if the roll is sucessful, false otherwise
//    */
//    function rollSkill40k(attribute,level,modifier)
//    {
//        var level_modifier = [-20,20,30,40,50];
//        level = parseInt(level);
//        modifier = parseInt(modifier);
//        return roll40k(attribute,level_modifier[level]+modifier);
//    }
//
//    /*
//        brief Rools initiative
//        param[in]   agility_atr     string/integer  Agility attribute value
//        return                      integer         Value of the init roll  
//    */
//    function rollInit40k(agility_attr)
//    {
//        return randomInteger(10) + floor(parseInt(agility_attr)/10);
//    }
//
//    function getSkillAttr40k(attribute)
//    {
//
//    }
//
//    /*
//    */
//    function attack40k(target,weapon_attr,modifier)
//    {
//        var status = "missed";
//
//        if (roll40k(weapon_attr,modifier))
//        {
//            var dodge_attr = getAttr40k(target,"DodgeCharacteristic");
//            var dodge_level = getAttr40k(target,"DodgeCharacteristic")
//            if (rollSkill40k(dodge_attr, dodge_level,modifier))
//            {
//                status = "hit";
//            }
//            else
//            {
//                status = "dodge";
//            }
//        }
//
//        return status;
//    }
//
//   // FRONT END

    var rollResultForSkill40k = function (skill_name, skill_value, skill_modifier_value, modifier) {
        var roll = randomInteger(100);
        var modTarget = parseInt(skill_value) + parseInt(modifier) + parseInt(skill_modifier_value);
        var msg = '';
        var roll_info = '';
        var roll_result = '';
        var degOfSuc = 0;

        roll_info = localize("Rolling-u") + ' ' + localize(skill_name);
        
        roll_info += ` <B> ${modTarget} (${skill_value} + ${skill_modifier_value} + ${modifier}).</B>` + 
        ' ' + localize("Rolled-a-u") + ' <B>' + roll + '.</B>';

        //Form output message based on result
        if (roll === 1) {
            roll_result = '<span style="color:orange">';
            msg += '<B>' + localize("Epic-sucess-u") + '</B>';
        }
        else if (roll === 100) {
            roll_result = '<span style="color:black">';
            msg += '<B>' + localize("Fumble-u") + '</B>';
        }
        else if (roll <= modTarget) {
            degOfSuc = (Math.floor(modTarget / 10) - Math.floor(roll / 10)) + 1;
            roll_result = '<span style="color:green">';
            msg += localize("Suceeds-by-u") + ' <B>' + degOfSuc + ' ' + localize("degree-u") + '.</B>';
        }
        else {
            degOfSuc = (Math.floor(roll / 10) - Math.floor(modTarget / 10)) + 1;
            roll_result = '<span style="color:red">';
            msg += localize("Fails-by-u") + ' <B>' + degOfSuc + ' ' + localize("degree-u") + '.</B>';
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
                sendChat(msg.who, '/w ' + msg.who + ' must specify 5 comma-separated parameters for the !skill40k command.'
                + '<br>'
                + '!skill40k token_name, skill_name, skill_value, skill_modifier, modifier');
            }
            else {
                var result = rollResultForSkill40k(
                    paramArray[1].trim(),
                    paramArray[2].trim(),
                    paramArray[3].trim(),
                    paramArray[4].trim()
                );
                //log(`rollResultForSkill40k(${paramArray[1].trim()},${paramArray[2].trim()},${paramArray[3].trim()},${paramArray[4].trim()})`);
                sendChat(paramArray[0].trim(), result);
                //log(`sendChat(${msg.who},${result})`);
            }
        }
    });

    function createCharacBtn(token,char_symb,char_name,char_attribute) {
        log(`createCharacBtn(${token},${char_symb},${char_name},${char_attribute})`);
        var html = '';
        html = '['+localize(char_symb)+' (@{'+token+'|'+char_attribute+'} + @{'+token+'|mod'+char_attribute+'})]'
        +'(!skill40k @{'+token+'|character_name},'+ localize(char_name)+',@{'+token+'|'+char_attribute+'},@{'+token+'|mod'+char_attribute+'},?{Total Modifiers|0})';
        return html;  
    };

    function createCharacRow(token,char_symb,char_name,char_attribute){
        log(`createCharacRow(${token},${char_symb},${char_name},${char_attribute})`);
        var html = '';
        html = '<tr>'
                +'<td>'
                    +createCharacBtn(token,char_symb,char_name,char_attribute)
                +'</td>'
                +'<td>'
                    +localize(char_name)
                +'</td>'
            +'</tr>'
        ;
        return html;
    };

    function createCharacTable(token) {
        log(`createCharacTable(${token});`);
        var html = ''
        html = '<table>'
        + createCharacRow(token,'ws-u','weaponskill-u','WeaponSkill')
        + createCharacRow(token,'bs-u','ballisticskill-u','BallisticSkill')
        + createCharacRow(token,'s-u','strength-u','Strength')
        + createCharacRow(token,'t-u','toughness-u','Toughness')
        + createCharacRow(token,'ag-u','agility-u','Agility')
        + createCharacRow(token,'int-u','intelligence-u','Intelligence')
        + createCharacRow(token,'per-u','perception-u','Perception')
        + createCharacRow(token,'wp-u','willpower-u','Willpower')
        + createCharacRow(token,'fel-u','fellowship-u','Fellowship')
        + '</table>'
        return html
    };

    on('chat:message', function (msg) {
        'use strict';
        var cmdName = '!charac40k';

        if (msg.type === 'api' && msg.content.indexOf(cmdName) !== -1) {
            log(`sendChat(${msg.who}, '/w '+ ${msg.who} + ' ' + createCharacTable(${msg.who}),null,{noarchive:true});`);
            sendChat(msg.who, '/w '+ msg.who + ' ' + createCharacTable(msg.who),null,{noarchive:true});
        }
    });

    var lang = {
        "weaponskill-u"     : "Capacité de Combat",
        "ws-u"              : "CC",
        "ballisticskill-u"  : "Capacité de Tir",
        "bs-u"              : "CT",
        "strength-u"        : "Force",
        "s-u"               : "F",
        "toughness-u"       : "Endurance",
        "t-u"               : "E",
        "agility-u"         : "Agilité",
        "ag-u"              : "Ag",
        "intelligence-u"    : "Intelligence",
        "int-u"             : "Int",
        "perception-u"      : "Perception",
        "per-u"             : "Per",
        "willpower-u"       : "Force Mentale",
        "wp-u"              : "FM",
        "fellowship-u"      : "Sociabilité",
        "fel-u"             : "Soc",
        "acrobatics-u"      : "Acrobatie",
        "athletics-u"       : "Athlétisme",
        "awareness-u"       : "Vigilance",
        "charm-u"           : "Charisme",
        "command-u"         : "Commandement",
        "commerce-u"        : "Commerce",
        "deceive-u"         : "Duperie",
        "dodge-u"           : "Esquive",
        "inquiry-u"         : "Enquête",
        "interrogation-u"   : "Interrogatoire",
        "intimidate-u"      : "Intimidation",
        "logic-u"           : "Logique",
        "medicae-u"         : "Medicae",
        "navigate-u"        : "Navigation",
        "surface-u"         : "Surface",
        "stellar-u"         : "Stellaire",
        "warp-u"            : "Warp",
        "operate-u"         : "Conduire",
        "aeronautica-u"     : "Aeronefs",
        "voidship-u"        : "Vaisseaux spatiaux",
        "parry-u"           : "Parade",
        "psyniscience-u"    : "Psyniscience",
        "scrutiny-u"        : "Surveillance",
        "security-u"        : "Sécurité",
        "sleight-of-hand-u" : "Escamotage",
        "stealth-u"         : "Discrétion",
        "survival-u"        : "Survie",
        "tech-use-u"        : "Technomaîtrise",
        "linguistics-u"     : "Linguistique",
        "trade-u"           : "Commerce",
        "lore-u"            : "Connaissance",
        "common-u"          : "Commun",
        "scholastic-u"      : "Scolastique",
        "forbidden-u"       : "Interdite",
        "Rolling-u"         : "Jet de",
        "Rolled-a-u"        : "Obtient",
        "Suceeds-by-u"      : "Réussite de",
        "Fails-by-u"        : "Echec de",
        "degree-u"          : "degré(s)",
        "Epic-sucess-u"     : "Réussite critique !",
        "Fumble-u"          : "Echec critique !"
    };

    var localize = function (key) {
        if (key in lang){
            return lang[key];
        }
        else {
            return key;
        }
    };

}())