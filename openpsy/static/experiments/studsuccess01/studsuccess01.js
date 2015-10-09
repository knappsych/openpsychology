/**
 * Created by wknapp on 9/23/2015.
 */
/**
 * Created by wknapp on 8/27/2015.
 */
//need to append this file with the subject id and also demographic information.
var subid = "pid";
var tTimer = trialTimer;
var subsection = ["security","discount"];
subsection = shuffleArray(subsection);
var section = ["demographics", subsection[0], subsection[1], "debrief"];
var current_section_number = 0;
var current_section = section[current_section_number];
var numTrialsPerBlock = 5
var firstTrial = true;
var blocks = ["One Day","One Week", "One Month", "6 Months", "One Year"];
blocks = shuffleArray(blocks);//randomize the order of blocks
var numBlocks=blocks.length;
var numTrialsTotal=numTrialsPerBlock*numBlocks;

var block=0;
var trial=0;
var amount=100;
var amounts={lo:0, mid:amount/2, hi:amount};


var likert5 = '<a href="javascript:void(0)" onclick="recordResults(\'completely_agree\')" class="ebuttonsmall">Completely ' +
        'agree</a><br>' +
        '<a href="javascript:void(0)" onclick="recordResults(\'somewhat_agree\')" class="ebuttonsmall">Somewhat ' +
        'agree</a><br>' +
        '<a href="javascript:void(0)" onclick="recordResults(\'neither_agree\')" class="ebuttonsmall">Neither ' +
        'agree nor disagree</a><br>' +
        '<a href="javascript:void(0)" onclick="recordResults(\'somewhat_disagree\')" class="ebuttonsmall">Somewhat ' +
        'disagree</a><br>' +
        '<a href="javascript:void(0)" onclick="recordResults(\'completely_disagree\')" class="ebuttonsmall">Completely ' +
        'disagree</a>';
//////////////////////////////////////////////////////////////////////////////////////////////////////
/////INSTRUCTIONS/////INSTRUCTIONS/////INSTRUCTIONS/////INSTRUCTIONS/////INSTRUCTIONS/////INSTRUCTIONS
//////////////////////////////////////////////////////////////////////////////////////////////////////
var demoInstructions =  '<p>In this part of the experiment, you will be asked a variety of demographic ' +
    'questions. Please answer honestly, or use the option to not answer the question.</p>\n' +
    '<p>To minimize distraction and better equate testing situations, the next page will be presented\n in full' +
    ' screen mode. So please select "allow" when prompted. If you\'re on a mobile ' +
    'device, please hold the screen horizontally for an\n optimal experience.</p>\n' +
    '<p><a href="javascript:void(0)" onclick="giveTrial()" class="ebutton">Click To Proceed</a></p>';

var securityInstructions = '<p>In this part of the experiment, you will be asked to indicate how agree with' +
    'using the following options:</p>'+
    'Completely Agree<br>Somewhat Agree<br>Neither Agree Nor Disagree<br>Somewhat Disagree<br>'+
    'Completely Disagree<br><br>'+
     '<p><a href="javascript:void(0)" onclick="giveTrial()" class="ebutton">Click To Proceed</a></p>';

var discountInstructions = '<p>In this part of the experiment, you will be asked to indicate which of two ' +
    'options you would prefer.</p>\n' +
    '<p> For example, given the choice between getting $10 today or $10 in a year, most would probably take ' +
    'the money today.</p>\n' +
    '<p>The right answer is the choice you would make if you were in such a situation.\n So please think ' +
    'about the options and select the ones that you would choose,\n  if you had the opportunity.</p>\n' +
    '<p><a href="javascript:void(0)" onclick="givePractice()" class="ebutton">Click To Proceed</a></p>';

var practiceInstructions = '<p>During the experiment you will be asked to make a choice.' +
    ' Please select the option you would prefer by clicking the corresponding button.</p>\n' +
    '<p><a href="javascript:void(0)" onclick="givePracticeFeedback(\'now\')" class="ebutton">$100 Now</a>' +
    '\n<a href="javascript:void(0)" onclick="givePracticeFeedback(\'later\')" class="ebutton">$100 ' +
    'In 6 Months</a></p>';

function givePracticeFeedback(selectedChoice){
    if(selectedChoice=="now"){
        $('#experiment').html('<p>You chose $100 now instead of $100 later. Nice!</p>\n' +
            '<p><a href="javascript:void(0)" onclick="trialLogic()" class="ebutton">Begin the experiment.</a></p>'
        );
    } else {
        $('#experiment').html(
            '<p>You chose $100 later instead of $100 now. That\'s a little odd as $100 will be worth less money in ' +
            'the\nfuture. However, if that\'s what you would really choose, select continue. If you don\'t ' +
            'understand the\ninstructions, please review them before continuing.</p>' +
            '<p><a href="javascript:void(0)" onclick="giveInstructions()" class="ebutton">Review the instructions.</a>\n' +
            '<a href="javascript:void(0)" onclick="trialLogic()" class="ebutton">Begin the ' +
            'experiment.</a></p>'
        );
    }
}

var blockInstructionsToReplace = '<p>For this portion of the experiment you\'ll be asked whether you prefer some ' +
    'amount today or $' + amount + ' in #REPLACE#.</p>\n<p><a href="javascript:void(0)" onclick="giveTrial()" ' +
    'class="ebutton">Continue.</a></p>';

//////////////////////////////////////////////////////////////////////////////////////////////////
/////////Trial Text/////////Trial Text/////////Trial Text/////////Trial Text/////////Trial Text///
//////////////////////////////////////////////////////////////////////////////////////////////////
var demoTrialText = '<p>#REPLACEQUESTION#</p>' +
        '<form action="javascript:void(0)" onsubmit="return recordResults()">' +
            '#REPLACEINPUT#<br><input type="submit" value"Submit">' +
        '</form>';

var securityTrialText = '<p>#REPLACESTATEMENT#</p>' + likert5;

var discountTrialText = '<p>Please select which option you would prefer by clicking the corresponding button.</p>' +
    '\n<p><a href="javascript:void(0)" onclick="recordResults(\'lo\')" class="ebutton">$' +
    '#REPLACEMID# Now</a>\n<a href="javascript:void(0)" onclick="recordResults(\'hi\')" ' +
    'class="ebutton">$#REPLACEAMOUNT# In #REPLACEDELAY#</a></p>';


//////////////////////////////////////////////////////////////////////////////////////////////////
////////CSV HEADERS////////CSV HEADERS////////CSV HEADERS////////CSV HEADERS////////CSV HEADERS///
//////////////////////////////////////////////////////////////////////////////////////////////////

var demoOutputCSV = 'sectno,subid,domain,trialnum,qnum,qtext,qresponse,trialstart,qresponsetime<br>';
var securityOutputCSV = 'sectno,subid,trialnum,qnum,qtext,qvalence,qtime,qresponse,trialstart,qresponsetime<br>';
var discountOutputCSV = 'sectno,subid,trialnum,blocknum,delay,trialstart,immediatechoice,delayedchoice,selectedchoice,selectedchoicetime<br>';

function giveInstructions(){
    if(current_section=="demographics"){
        $('#experiment').html(demoInstructions);
    }
    else if(current_section=="security") {
        $('#experiment').html(securityInstructions);
    }
    else if(current_section=="discount"){
        $('#experiment').html(discountInstructions);
    }
    else{
          giveDebriefing();
    }
}

function givePractice(){
    $('#experiment').html(practiceInstructions);
}

function giveBlockInstructions(thisBlock){
    $('#experiment').html(blockInstructionsToReplace.replace("#REPLACE#", blocks[thisBlock].toLowerCase()));
}

function giveTrial(){
    if(firstTrial){
        openFullScreen();
        firstTrial = false;
    }
    if(current_section=="demographics"){
        var q = demo_questions[demo_question_order[trial]];
        var i = demo_input[demo_question_order[trial]];
        var temp = demoTrialText.replace(/#REPLACEQUESTION#/g, q);
        temp = temp.replace(/#REPLACEINPUT#/g, i);
        $('#experiment').html(temp);
    }
    else if(current_section=="security"){
        var q = security_questions[security_question_order[trial]];
        var temp = securityTrialText.replace(/#REPLACESTATEMENT#/g, q);
        $('#experiment').html(temp);
    }
    else if(current_section=="discount"){
        var temp = discountTrialText.replace(/#REPLACEMID#/g, amounts.mid);
        temp = temp.replace(/#REPLACEAMOUNT#/g, amount);
        temp = temp.replace(/#REPLACEDELAY#/g, blocks[block]);
        $('#experiment').html(temp);
    }
    tTimer.startTiming();
}

function recordResults(selectedChoice){
    //alert("The section is "+ current_section_number + ". The block is " + block + ". The trial is " + trial);
    var rt=tTimer.msPassed();
    var startt=tTimer.startTime;
    tTimer.resetTiming();
    if(current_section=="demographics") {
        //We need to get the value of the form
        var id_name = demo_names[demo_question_order[trial]];
        var qresponse = $('#'+id_name).val();
        var qresponse = $('#'+id_name).val();
        //alert('The id_name is ' + id_name + '. and qresponse is ' + qresponse + '.')
        qnum = demo_question_number[demo_question_order[trial]];
        qname = demo_names[demo_question_order[trial]];

        //the templage
        //section,subid,trialnum,qnum,qname,qresponse,trialstart,qresponsetime
        var outputArray = [current_section_number + 1, subid, 'domain_id', trial + 1, qnum, qname, qresponse, startt, rt];
        demoOutputCSV += outputArray.join(',') + '<br>';
        trial++;
        trialLogic();
    }
    else if(current_section=="security"){
        qnum = security_question_number[security_question_order[trial]];
        qtext = security_questions[security_question_order[trial]];
        qtext = qtext.replace(/,/g, "");
        qvalence = security_security[security_question_order[trial]];
        qtime = security_times[security_question_order[trial]];

        //the template
        //sectno,subid,trialnum,qnum,qtext,qvalence,qtime,qresponse,trialstart,gresponsetime
        var outputArray = [current_section_number + 1, "pid", trial + 1, qnum, qtext, qvalence, qtime, selectedChoice, startt, rt];
        securityOutputCSV += outputArray.join(',') + '<br>';
        trial++;
        trialLogic();
    }
    else if(current_section=="discount"){
        var thechoice = selectedChoice == "lo" ? amounts.mid : amount;
        //The template
        //sectno,subid,trialnum,blocknum,delay,trialstart,immediatechoice,delayedchoice,selectedchoice,selectedchoicetime
        var outputArray = [current_section_number + 1, "pid", trial + 1, block + 1, blocks[block], startt, amounts.mid, amount, thechoice, rt];
        discountOutputCSV += outputArray.join(',') + '<br>';
        updateAmounts(selectedChoice);
    }
    else giveDebriefing()
}

function updateAmounts(selectedChoice){
    var newAmount = undefined;
    //if the participant chooses the larger amount raise the bottom one halfway
    if(selectedChoice=="hi"){
        newAmount = (parseFloat(amounts.mid)+parseFloat(amounts.hi))/2;
        if (newAmount%1>=.01){
            newAmount = newAmount.toFixed(2);
        }
        amounts.lo = amounts.mid;
    } else {
        newAmount = (parseFloat(amounts.mid)+parseFloat(amounts.lo))/2;
        if (newAmount%1){
            newAmount = newAmount.toFixed(2);
        }
        amounts.hi = amounts.mid;
    }
    amounts.mid = newAmount;
    trial++;
    trialLogic();
}

function resetAmounts(){
    amounts = {lo: 0, mid: amount/2, hi: amount};
}

function giveDebriefing(){
    //alert("In Debriefing")
    //Try to make this DRY so get the current url.
    replacement_html = $("#participant_form").html();
    replacement_html = replacement_html.replace("#DEMODATAREPLACE#", demoOutputCSV);
    replacement_html = replacement_html.replace("#SECURITYDATAREPLACE#", securityOutputCSV);
    replacement_html = replacement_html.replace("#DISCOUNTDATAREPLACE#", discountOutputCSV);
    $("#participant_form").html(replacement_html);
    $('#submit_data').submit();
}



function trialLogic(){
    if (current_section=="demographics") {
        if(trial<demo_questions.length) {
            giveTrial();
        }
        else{
            current_section_number++;
            current_section=section[current_section_number];
            trial=0;
            giveInstructions();
        }
    }
    else if (current_section=="security") {
        if(trial<security_questions.length){
            giveTrial();
        }
        else{
            current_section_number++;
            current_section=section[current_section_number];
            trial=0;
            giveInstructions();
        }
    }
    else if (current_section=="discount") {
        if (trial == numTrialsTotal) {
            current_section_number++;
            current_section=section[current_section_number];
            trial=0;
            giveInstructions();
        } else if (trial % numTrialsPerBlock === 0 && trial != numTrialsTotal) {
            if(trial>0){
                block++;
            }
            resetAmounts();
            giveBlockInstructions(block);
        } else {
            giveTrial();
        }
    }
    else giveDebriefing();
}

//Needed for the csrftoken
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var security_questions = [
    "While growing up, my caregivers regularly took me out to eat at nice restaurants.",
    "While growing up, my caregivers never had to wait until they could afford to repair or replace something.",
    "While growing up, my caregivers were more likely to replace than repair worn or damaged items.",
    "While growing up, my caregivers regularly signed me up for sports, music lessons, or other beneficial activities.",
    "While growing up, my caregivers made sure they got me the best products available.",
    "While growing up, my caregivers relied on public assistance (e.g. welfare, Medicaid, or food stamps).",
    "While growing up, my caregivers regularly fought about money.",
    "While growing up, my caregivers' paydays were big deals.",
    "While growing up, I regularly wore second-hand clothes.",
    "While growing up, Ramen, potatoes, rice, and/or other inexpensive foods were staples of my diet.",
    "I have enough savings to deal with unexpected expenses (e.g. replacing worn out tires).",
    "I currently have a regular source of income (e.g. a job or allowance).",
    "When deciding what to order at a restaurant, I don't consider the price.",
    "Money isn't a concern for me.",
    "I never buy generics.",
    "I always worry about money.",
    "I barely survive paycheck to paycheck.",
    "I'm more likely to attend an event I'm not interested in, if there's free food.",
    "Ramen, potatoes, rice, and or other inexpensive foods are staples of my diet.",
    "Even when I need something, I often wait for a sale to get a better deal."
];

var security_times = [
    "Past",
    "Past",
    "Past",
    "Past",
    "Past",
    "Past",
    "Past",
    "Past",
    "Past",
    "Past",
    "Current",
    "Current",
    "Current",
    "Current",
    "Current",
    "Current",
    "Current",
    "Current",
    "Current",
    "Current"
];

var security_security = [
    "Secure",
    "Secure",
    "Secure",
    "Secure",
    "Secure",
    "Insecure",
    "Insecure",
    "Insecure",
    "Insecure",
    "Insecure",
    "Secure",
    "Secure",
    "Secure",
    "Secure",
    "Secure",
    "Insecure",
    "Insecure",
    "Insecure",
    "Insecure",
    "Insecure"
];

var security_question_number = $.map($(Array(security_questions.length)),function(val, i) { return i; });

var security_question_order =
    shuffleArray($.map($(Array(security_questions.length)),function(val, i) { return i; }));

var demo_questions = [
    "How old are you? Leave the box blank if you don't want to answer this question.",
    "What is your biological sex?",
    "What's the last level of education you completed?",
    "Are you left handed, right handed, or ambidextrous?",
    "Is English your first language?",
    "How many languages do you speak fluently? Leave the box blank if you don't want to answer this question.",
    "If you are an undergraduate college student, what year are you in?",
    "Have you been offered any incentive for participating in this study?"
];

var demo_names = [
    "age",
    "sex",
    "highest_grade",
    "hand",
    "english",
    "languages",
    "current_year",
    "incentive"
];

var demo_input = [
    '<input type="text" name="' + demo_names[0] + '" id="' + demo_names[0] + '">',

    '<select name="' + demo_names[1] + '" id="' + demo_names[1] + '">' +
        '<option value="female">Female</option>' +
        '<option value="male">Male</option>' +
        '<option value="other">Other</option>' +
        '<option value="noanswer">I prefer not to answer</option>' +
    '</select>',

    '<select name="' + demo_names[2] + '" id="' + demo_names[2] + '">' +
        '<option value="sixth">Sixth grade or less</option>' +
        '<option value="seventh">Seventh grade</option>' +
        '<option value="eigth">Eighth grade</option>' +
        '<option value="ninth">Freshman year of high school</option>' +
        '<option value="tenth">Sophomore year of high school</option>' +
        '<option value="eleventh">Junior year of high school</option>' +
        '<option value="twelfth">Senior year of high school</option>' +
        '<option value="freshman">Freshman year of college</option>' +
        '<option value="sophomore">Sophomore year of college</option>' +
        '<option value="junior">Junior year of college</option>' +
        '<option value="senior">College graduate</option>' +
        '<option value="master">Master\'s degree</option>' +
        '<option value="terminal">Ph.D., M.D. J.D. or other equivalent</option>' +
        '<option value="noanswer">I prefer not to answer</option>' +
    '</select>',

    '<select name="' + demo_names[3] + '" id="' + demo_names[3] + '">' +
        '<option value="left">Left handed</option>' +
        '<option value="right">Right handed</option>' +
        '<option value="ambidexterous">Ambidexterous</option>' +
        '<option value="noanswer">I prefer not to answer</option>' +
    '</select>',

    '<select name="' + demo_names[4] + '" id="' + demo_names[4] + '">' +
        '<option value="no">No</option>' +
        '<option value="yes">Yes</option>' +
        '<option value="noanswer">I prefer not to answer</option>' +
    '</select>',

    '<input type="text" name="' + demo_names[5] + '" id="' + demo_names[5] + '">',

    '<select name="' + demo_names[6] + '" id="' + demo_names[6] + '">' +
        '<option value="freshman">Freshman year of college</option>' +
        '<option value="sophomore">Sophomore year of college</option>' +
        '<option value="junior">Junior year of college</option>' +
        '<option value="senior">Senior year of college</option>' +
        '<option value="nocollege" selected="selected">I\'m not in college.</option>' +
        '<option value="noanswer">I prefer not to answer</option>' +
    '</select>',

    '<select name="' + demo_names[7] + '" id="' + demo_names[7] + '">' +
        '<option value="no">No</option>' +
        '<option value="yes">Yes</option>' +
        '<option value="noanswer">I prefer not to answer</option>' +
    '</select>'
];

var demo_question_number = $.map($(Array(demo_questions.length)),function(val, i) { return i; });

var demo_question_order =
    shuffleArray($.map($(Array(demo_questions.length)),function(val, i) { return i; }));

function begin_experiment(){
    giveInstructions();
}

