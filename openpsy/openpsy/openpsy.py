from django.core.mail import send_mail
from django.core.validators import validate_email

__author__ = 'wknapp'

def verify_and_send_email_form(request, page_title, recipient):
    errors=0
    email_error = False
    subject_error = False
    message_error = False
    subject = ""
    message = ""
    sender = ""
    email_sent=False;
    if request.method == "POST":
        subject = request.POST.get("subject")
        message = request.POST.get("message")
        sender = request.POST.get("email")

        email_error = False
        subject_error = False
        message_error = False
        try:
            validate_email(sender)
        except ValidationError:
            email_error = True
            errors = errors + 1
        if(len(subject)<10):
            subject_error = True
            errors = errors + 1
        if(len(message)<50):
            message_error = True
            errors = errors + 1
        if errors==0:
            send_mail(subject, message, sender, [recipient])
            email_sent = True
    return {"page_title": page_title,
            "email_sent": email_sent,
            "subject_error": subject_error,
            "subject": subject,
            "email_error": email_error,
            "email": sender,
            "message_error": message_error,
            "message": message
            }


def send_contact_email(subject, message, sender):
    sub = "Consent to participate in " + experiment.pretty_name.lower() + "."
    mes = """
    Thank you for agreeing to participate in the study about %(pretty)s. Not
    only are you playing a vital role in the scientific process, you should
    learn a little something about how scientists investigate the world around
    them.

    To participate, please enter the following code into the box you should
    see after you indicated that you voluntarily consented to participate in this
    study:

    %(a_code)s

    Thank you, again for agreeing to participate.

    William H. Knapp III
    Open Psychology Founder, Researcher, and Maintainer
    """ % {"pretty": experiment.pretty_name.lower(), "a_code": participant.a_code}

    sender = "william@openpsychology.com"
    recipient = user.email

    send_mail(sub, mes, sender, [recipient], fail_silently=False)