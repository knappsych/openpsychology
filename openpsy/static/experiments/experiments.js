/**
 * Created by wknapp on 9/20/2015.
 */

function testFullScreen() {
    //based on MDN: https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode#Toggling_fullscreen_mode
    //If there are no full screens, return false
    return (document.fullscreenElement || document.mozFullScreenElement ||
    document.webkitFullscreenElement || document.msFullscreenElement);
}

function openFullScreen(){
    //based on MDN: https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode#Toggling_fullscreen_mode
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
		alert("We detected that you're using MS Internet Explorer. Please press the 'F11' key " +
            "twice to properly view the experiment.")
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
}

function closeFullScreen(){
    //based on MDN: https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode#Toggling_fullscreen_mode
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

function shuffleArray(array){
    //based on Laurens Holst's solution at http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    for (var i = array.length - 1; i > 0; i--){
        var j = array.length;
        while (j == array.length){
            j = Math.floor(Math.random()*(i+1));//will range from 0 to array.length+1
        }
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

var trialTimer = {
    startTime:  null,
    stopTime: null,

    //only start the timer if a timer isn't already running
    startTiming: function(){
        if (this.startTime) {
            return false;
        } else {
            this.startTime = (new Date()).valueOf();
            this.stopTime = null;
        }
    },

    //reset the timer to the null value
    resetTiming: function(){
        this.startTime = null;
        this.stopTime = null;
    },

    //returns the number of milliseconds passed for a started counter
    msPassed: function(){
        if(this.startTime){
            return ((new Date()).valueOf() - this.startTime);
        } else return null;
    },

    //returns the time the user stopped the timing
    stopTiming: function(){
        if(this.startTime){
            this.stopTime =  ((new Date()).valueOf() - this.startTime);
        } else return null;
    }
}


function form_check_email(){
    var Email = $( "#id_email").val();
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (regex.test(Email)){
        return true;
    }
    else{
        changeCSS ($( "#form_errors" ), "class", "caution inline");
        return false;
    }
}

function form_check_access_code(){
    var a_code = $( "#access_code").val();
    var regex = /^[a-zA-Z0-9]{10}$/;
    if (regex.test(a_code)){
        return true;
    }
    else{
        changeCSS ($( "#form_errors" ), "class", "caution inline");
        return false;
    }
}

function counterBalance2(v1,v2,reps){
    var arr = new Array([]);
    for(var a = 0; a < 2; a++){
        arr[a]=[];
    }
    var i = 0;
    for(var r = 0; r < reps; r++){
        for(var l1 = 0; l1 < v1.length; l1++){
            for(var l2 = 0; l2 < v2.length; l2++){
                arr[0][i] = v1[l1];
                arr[1][i] = v2[l2];
                i++;
            }
        }
    }
    return arr;
}

function counterBalance3(v1,v2,v3,reps){
    var arr = [];
    for(var a = 0; a < 3; a++){
        arr[a]=[];
    }
    var i = 0;
    for(var r = 0; r < reps; r++){
        for(var l1 = 0; l1 < v1.length; l1++){
            for(var l2 = 0; l2 < v2.length; l2++){
                for(var l3 = 0; l3 < v3.length; l3++){
                    arr[0][i] = v1[l1];
                    arr[1][i] = v2[l2];
                    arr[2][i] = v3[l3];
                    i++;
                }
            }
        }
    }
    return arr;
}

function createExperimentCanvas(cwidth,cheight){
    $('#experiment').html('<canvas id="expCanvas" width="' + cwidth +
        '" height=' + cheight + '"></canvas>')
}