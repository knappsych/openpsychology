/**
 * Created by wknapp on 9/21/2015.
 */
function changeCSS (id, property, setting){
	id.attr(property, setting);
}

function form_check_contact(){
	var error_message = ""
	var Email = $( "#id_sender_email").val();
    var subject = $( "#id_subject").val();
	var message = $( "#id_message").val();
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(Email)){
        error_message = error_message + "<p>Please, use a valid email address.<p/>"
    }
	if (subject.length<10){
		error_message = error_message + "<p>Please, use a more descriptive subject.<p/>"
	}
	if (message.length<50){
		error_message = error_message + "<p>Please, include more detail about your inquiry in your message.<p/>"
	}
    if (error_message==""){
		return true
	}

	else{
        changeCSS ($( "#form_errors" ), "class", "caution inline");
		changeCSS ($( "#post_errors" ), "class", "nodisplay");
        $( "#form_errors").html(error_message)
		return false;
    }
}
