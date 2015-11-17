/**
 * Created by wknapp on 10/26/2015.
 */

var pSize = 100; //Size of the placeholder
var tSize = 50; //Size of the target
var fixSize = 40;
var canvasHeight = 2*pSize;
var canvasWidth = 6*pSize;
var ltLoc = [canvasWidth/2-2*pSize, canvasHeight/2-pSize/2, pSize, pSize];
var ltTLoc = [canvasWidth/2-1.5*pSize-tSize/2, canvasHeight/2-tSize/2,tSize,tSize];
var rtLoc = [canvasWidth/2+pSize, canvasHeight/2-pSize/2, pSize, pSize];
var rtTLoc = [canvasWidth/2+1.5*pSize-tSize/2, canvasHeight/2-tSize/2,tSize,tSize];
var locLineWidth=10;
var fixLineWidth=8;
var cueLineWidth=14;
var locColor = "#AAAAAA";
var cueColor = "#FFFFFF";
var ctx = null;
var responseTimer;
var age = null;
var sex = null;
var hand = null;
var english = null;
var browser = navigator.userAgent;
browser = browser.replace(/,/g, ';');
//A variable to handle stepping through the instructions and demographic questions
var instructionStep = 0;
var demoStep = 0;

//The variables and the information we'll need to create our list of trials
var locVar = ["left", "right"];
var validityVar = ["valid", "invalid"];
var SOAVar = [100, 600];
var nunique = locVar.length*validityVar.length*SOAVar.length;
var nreps = 8;
var nTrialsTotal = nunique * nreps;
var trialArray = counterBalance3(locVar,validityVar,SOAVar,nreps);
var pointerArray = new Array([]);
var placeTime = 1200;
var cueDuration = 50;
var trialITI = 1000;
var maxRT = 2000;
var trialStep = 0;
var targLoc = new Array([]);
var trialNumArr = new Array([]);
var trialNum = 0;
var trialStartTime = new Array([]);
var trialCueOnTime = new Array([]);
var trialCueOffTime = new Array([]);
var trialTargetTime = new Array([]);
var trialResponseTime = new Array([]);


//output header
var demoOutputCSV = 'broswer,participantID,domain_id,gender,age,hand,english<br>';
var IOROutputCSV = 'participantID,trial,starttime,cueontime,cueofftime,targtime,responsetime,rt,cueloc,cuevalidity,soa,targloc<br>';

function setUpTrials(){
    for (var p = 0; p < nTrialsTotal; p++){pointerArray[p]=p;}
    pointerArray = shuffleArray(pointerArray);
}

function nextStep(step){
    if(step == "demographics"){
        getDemographics();
    }
    else if (step == "instructions"){
        $('html').click(function(){void(0)});
        presentInstructions();
    }
    else if (step == "experiment"){
        createExperimentCanvas(canvasWidth,canvasHeight);
        var c = document.getElementById("expCanvas");
        ctx = c.getContext("2d");
        setUpTrials();
        runExperiment();
    }
    else{
        closeFullScreen();
        giveDebriefing();
    }
}

function getDemographics(){
    var q = demo_questions[demo_question_order[demoStep]];
    var i = demo_input[demo_question_order[demoStep]];
    var temp = demoText.replace(/#REPLACEQUESTION#/g, q);
    temp = temp.replace(/#REPLACEINPUT#/g, i);
    if(demoStep==0){
        openFullScreen();
        temp = '<p>Let\'s begin with four demographic questions' + temp;
    }
    $('#experiment').html(temp);
}

function presentInstructions(){
    instructionStep = instructionStep + 1;
    $('html').unbind("click");//unbind the click just in case
    if(instructionStep == 1){
        $('#experiment').html('');//Clear the original instructions
        openFullScreen();//Open the full screen
        setTimeout(function(){presentInstructions()},200);
    }
    else if(instructionStep == 2){
        $('#experiment').html('<p>At the beginning of each trial, ' +
            'you\'ll see two place holders and a fixation cross. An ' +
            'example of this is shown below. A small square target ' +
            'will appear in one of those locations. Your job ' +
            'is to click your mouse or the screen, as soon as you ' +
            'detect the target. To have the best chance of detecting ' +
            'the target quickly, you should stay focused on the ' +
            'central fixation cross.</p> ' +
            '<canvas id="expCanvas" width="' + canvasWidth +
            '" height=' + canvasHeight + '"></canvas> ' +
            '<p>Please click anywhere to continue.</p>'
        );
        var c = document.getElementById("expCanvas");
        ctx = c.getContext("2d");
        placeHolderDisplay();
        $('html').click(function(){presentInstructions()});
    }
    else if(instructionStep == 3){
        $('#experiment').html('<p>Shortly before the target is ' +
            'presented, one of the placeholders will briefly ' +
            'brighten. This brief change is irrelevant to where ' +
            'the target will appear, so you should ignore it and ' +
            'stay focused on the central fixation cross. An example ' +
            'of what the brightening will look like is shown below</p> ' +
            '<canvas id="expCanvas" width="' + canvasWidth +
            '" height=' + canvasHeight + '"></canvas> ' +
            '<p>Please click anywhere to continue.</p>'
        );
        var c = document.getElementById("expCanvas");
        ctx = c.getContext("2d");
        placeHolderDisplay();
        cueLocation('right');
        $('html').click(function(){presentInstructions()});
    }
    else if(instructionStep == 4){
        $('#experiment').html('<p>An example of what the target will ' +
            'look like is presented below. Your job is to click anywhere ' +
            'as soon as you see it.</p> ' +
            '<canvas id="expCanvas" width="' + canvasWidth +
            '" height=' + canvasHeight + '"></canvas>' +
            '<p>Please click anywhere to continue.</p>'
        );
        var c = document.getElementById("expCanvas");
        ctx = c.getContext("2d");
        placeHolderDisplay();
        presentTarget('left');
        $('html').click(function(){presentInstructions()});
    }
    else if(instructionStep == 5){
        $('#experiment').html('<p>Get Ready to Begin</p>');
        $('html').unbind("click");
        setTimeout(function(){nextStep("experiment")},2000);
    }
}

function runExperiment(){
    if(trialNum == nTrialsTotal){
        nextStep("finished");
    }
    else if(trialStep==0){
        //Present Placeholders for one second
        trialTimer.startTiming();
        trialStartTime[trialNum] = trialTimer.startTime;
        placeHolderDisplay();
        trialStep = trialStep + 1;
        trialNumArr[trialNum] = trialNum + 1;
        setTimeout(runExperiment,placeTime);
    }
    else if(trialStep==1){
        //Present the cue
        var cueLoc = trialArray[0][pointerArray[trialNum]];
        cueLocation(cueLoc);
        trialCueOnTime[trialNum] = trialTimer.msPassed();
        trialStep = trialStep + 1;
        setTimeout(runExperiment,cueDuration);
    }
    else if(trialStep==2){
        //Remove the cue and wait to present the target
        var soaDelay = trialArray[2][pointerArray[trialNum]] - cueDuration;
        placeHolderDisplay();
        trialCueOffTime[trialNum] = trialTimer.msPassed();
        trialStep = trialStep + 1;
        setTimeout(runExperiment,soaDelay);
    }
    else if(trialStep==3){
        //present the target and attach onclick event to the window
        var cueLoc = trialArray[0][pointerArray[trialNum]];
        var cueValidity = trialArray[1][pointerArray[trialNum]];
        var tLoc = cueLoc;
        if (cueValidity != "valid"){
            if(cueLoc=="right"){
                tLoc = "left";
            }
            else{
                tLoc = "right";
            }
        }
        targLoc[trialNum] = tLoc;
        presentTarget(tLoc);
        trialTargetTime[trialNum] = trialTimer.msPassed();
        trialStep = trialStep + 1;
        $('html').click(function(){getRT()});
        responseTimer = setTimeout(runExperiment, maxRT);
    }
    else{
        //turn off the clicker and record the time
        $('html').unbind("click");
        if(trialTimer.stopTime){
            trialResponseTime[trialNum] = trialTimer.stopTime;
        }
        else{
            trialResponseTime[trialNum] = maxRT;
        }
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        //pid,trial,starttime,cueontime,cueofftime,targtime,responsetime,rt,cueloc,cuevalidity,soa,targloc'
        var outputArray = ['pid', trialNum + 1,
            trialTimer.startTime, trialCueOnTime[trialNum], trialCueOffTime[trialNum],trialTargetTime[trialNum],
            trialResponseTime[trialNum], trialResponseTime[trialNum]-trialTargetTime[trialNum],
            trialArray[0][pointerArray[trialNum]],
            trialArray[1][pointerArray[trialNum]],
            trialArray[2][pointerArray[trialNum]],targLoc[trialNum]];
        IOROutputCSV += outputArray.join(',') + '<br>';
        trialTimer.resetTiming();
        trialNum = trialNum + 1;
        trialStep = 0;
        var trialsLeft = nTrialsTotal - trialNum;
        ctx.font="20px Georgia";
        var feedback = "1 trial left.";
        if(trialsLeft>1){feedback = trialsLeft + " trials left"}
        ctx.textAlign="center";
        if(trialsLeft>0){ctx.fillText(feedback, canvasWidth/2, canvasHeight/2);}
        setTimeout(runExperiment,trialITI);
    }
}

function getRT(){
    clearTimeout(responseTimer);
    trialTimer.stopTiming();
    runExperiment();
}

function placeHolderDisplay(){
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    drawPlaceHolder(ltLoc[0],ltLoc[1],ltLoc[2],ltLoc[3],locColor,locLineWidth);
    drawPlaceHolder(rtLoc[0],rtLoc[1],rtLoc[2],rtLoc[3],locColor,locLineWidth);
    drawFixation(locColor,fixLineWidth);
}

function drawPlaceHolder(x, y, width, height, color,lWidth){
    ctx.beginPath();
    ctx.rect(x,y,width,height,color);
    ctx.lineWidth=lWidth;
    ctx.strokeStyle=color;
    ctx.stroke();
}

function cueLocation(location){
    var loc = ltLoc;
    if (location == "right") loc=rtLoc;
    drawPlaceHolder(loc[0],loc[1],loc[2],loc[3],cueColor,cueLineWidth);
}

function drawFixation(color,lWidth){
    ctx.lineWidth=lWidth;
    ctx.strokeStyle=color;
    ctx.beginPath();
    ctx.moveTo(canvasWidth/2,canvasHeight/2-fixSize/2);
    ctx.lineTo(canvasWidth/2,canvasHeight/2+fixSize/2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth/2-fixSize/2,canvasHeight/2);
    ctx.lineTo(canvasWidth/2+fixSize/2,canvasHeight/2);
    ctx.stroke();
}

function presentTarget(location){
    var loc = ltTLoc;
    if(location == "right") loc = rtTLoc;
    ctx.beginPath();
    ctx.fillStyle=cueColor;
    ctx.fillRect(loc[0],loc[1],loc[2],loc[3]);
    ctx.stroke();
}

var demo_questions = [
    "How old are you? Leave the box blank if you don't want to answer this question.",
    "What is your biological sex?",
    "Are you left handed, right handed, or ambidextrous?",
    "Is English your first language?"
];

var demo_names = [
    "age",
    "sex",
    "hand",
    "english"
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
    '<option value="left">Left handed</option>' +
    '<option value="right">Right handed</option>' +
    '<option value="ambidexterous">Ambidexterous</option>' +
    '<option value="noanswer">I prefer not to answer</option>' +
    '</select>',

    '<select name="' + demo_names[3] + '" id="' + demo_names[3] + '">' +
    '<option value="no">No</option>' +
    '<option value="yes">Yes</option>' +
    '<option value="noanswer">I prefer not to answer</option>' +
    '</select>'
];

var demo_question_order =
    shuffleArray($.map($(Array(demo_questions.length)),function(val, i) { return i; }));

var demoText = '<p>#REPLACEQUESTION#</p>' +
        '<form action="javascript:void(0)" onsubmit="return recordDemographics()">' +
        '#REPLACEINPUT#<br><input type="submit" value"Submit">' +
        '</form>';

function recordDemographics (){
    var id_name = demo_names[demo_question_order[demoStep]];
    var qresponse = $('#'+id_name).val();
    if(id_name=="age"){
        age = qresponse;
    }
    else if(id_name == "english"){
        english = qresponse;
    }
    else if(id_name == "hand"){
        hand = qresponse;
    }
    else if(id_name == "sex"){
        sex = qresponse;
    }
    demoStep += 1;
    if(demoStep < demo_names.length){
        getDemographics();
    }
    else {
        //broswer,pid,gender,age,hand,english
        var outputArray = [browser, 'pid', 'domain_id', sex, age, hand, english];
        demoOutputCSV += outputArray.join(',') + '<br>';
        nextStep("instructions");
    }
}

function giveDebriefing(){
    //alert("In Debriefing")
    //Try to make this DRY so get the current url.
    replacement_html = $("#participant_form").html();
    replacement_html = replacement_html.replace("#DEMODATAREPLACE#", demoOutputCSV);
    replacement_html = replacement_html.replace("#IOR01DATAREPLACE#", IOROutputCSV);
    $("#participant_form").html(replacement_html);
    $('#submit_data').submit();
}