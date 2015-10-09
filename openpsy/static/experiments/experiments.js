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

function toggleFullScreen() {
    //based on MDN: https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode#Toggling_fullscreen_mode
    if (testFullScreen()) {  // current working methods
        closeFullScreen();
    } else {
        openFullScreen();
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

    //only start the timer if a timer isn't already running
    startTiming: function(){
        if (this.startTime) {
            return false;
        } else {
            this.startTime = (new Date()).valueOf();
        }
    },

    //reset the timer to the null value
    resetTiming: function(){
        this.startTime = null;
    },

    //returns the number of milliseconds passed for a started counter
    msPassed: function(){
        if(this.startTime){
            return ((new Date()).valueOf() - this.startTime);
        } else return null;
    }
};

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
};

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
};