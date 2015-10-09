from django.db import connection
from experiments.models import UserForm, Experiment, User, Participant
from django.template.context_processors import csrf
from django.core.mail import send_mail
from experiments.private import create_participant_id, create_participant_access_code
import datetime
from django.utils import timezone
import re
import os
from django.core.files import File
from django.core.validators import validate_email

__author__ = 'wknapp'


def dictfetchall(cursor):
    "Return all rows from a cursor as a dictionary"
    desc = cursor.description
    return[
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]

def experiment_list_view_context():
    rawsql="""
        SELECT experiments_experiment.pretty_name,
        experiments_experiment.url_name,
        experiments_primaryinvestigator.first_name,
        experiments_primaryinvestigator.last_name,
        experiments_institution.institution_name
        FROM experiments_experiment
        LEFT JOIN experiments_primaryinvestigator
        ON experiments_experiment.pi_id = experiments_primaryinvestigator.id
        LEFT JOIN experiments_institution
        ON experiments_experiment.institution_id = experiments_institution.id
        WHERE experiments_experiment.active = TRUE
    """
    cursor = connection.cursor()
    cursor.execute(rawsql)
    exps = dictfetchall(cursor)
    connection.close()

    c = {'page_title': 'Current experiments', 'exps': exps}

    return c


def consent_view_context(request, e_name):
    have_page=True
    try:
        exp=Experiment.objects.get(url_name=e_name)
    except:
        have_page=False
    form = UserForm()

    c = {"pretty_name": exp.pretty_name.lower(),
         "consent_form": form,
         "e_name": e_name,
         "have_page": have_page}
    c.update(csrf(request))

    return c


def validate_view_processor(request, e_name):
    # For easy testing try the following
    # return {"which_version": "no email"}
    # return {"which_version": "no experiment"}
    # return {"which_version": "already participated"}
    # return {"which_version": "couldn't send email"}
    # return {"which_version": "validate"}

    # Get the experiment data
    exp = None
    try:
        exp = Experiment.objects.get(url_name=e_name)
    except:
        return {"which_version": "no experiment", "e_name": e_name, "pretty_name": exp.pretty_name.lower()}

    try:
        validate_email(request.POST.get("email"))
    except ValidationError:
        return {"which_version": "no email", "e_name": e_name, "pretty_name": exp.pretty_name.lower()}

    user_email = request.POST.get("email")
    permission = request.POST.get("permission_to_contact")
    permission = permission == "on"

    # Set session
    request.session['email'] = user_email
    request.session['submitted'] = False

    # Create variable we'll contain the user information in
    user = None
    # Make sure there's not already a user before creating one
    try:
        user = User.objects.get(email=user_email)
        # There is a user. Check to see if the permission
        # needs changing.
    except: # There was no user, so create one
        user = User(email=user_email)
        user.save()

    if(permission != user.permission_to_contact):
        user.permission_to_contact = permission
        user.save()

    # Create the participant id number
    pid = create_participant_id(user, e_name, permission)

    # Create an access code for the participant
    a_code = create_participant_access_code(pid, e_name, permission)

    # Get the institution for the participant
    institute = user_email.split("@")[1]

    # Check to see if they're already in the database and whether
    # or not they can participate again
    subject=None
    try:
        subject = Participant.objects.get(participant=pid, experiment=exp.id)
    except:
        subject = Participant(participant=pid,
                            experiment=exp,
                            institution=institute,
                            access_code=a_code,
                            participation_time=0,
                            time_last_participated=timezone.now(),
                              )
        subject.save()

    if((subject.participation_time == 0) or (exp.repeat == "t")):
        if(subject.participation_time > 0): #They've already participated
            #Check that they've waited enough time
            time_to_participate = None
            if(exp.repeat_delay_units=="hours"):
                time_to_participate = subject.time_last_participated + datetime.timedelta(hours=exp.repeat_delay)
            elif(exp.repeat_delay_units=="days"):
                time_to_participate = subject.time_last_participated + datetime.timedelta(days=exp.repeat_delay)
            elif(exp.repeat_delay_units=="months"):
                time_to_participate = subject.time_last_participated + datetime.timedelta(days=exp.repeat_delay*30)
            else:
                time_to_participate = subject.time_last_participated + datetime.timedelta(days=exp.repeat_delay*365)
            if time_to_participate > timezone.now():
                time_string = time_to_participate.strftime("%I:%M %p, %B %d, %Y")
                return {"which_version": "have to wait", "e_name": e_name, "pretty_name": exp.pretty_name.lower(),
                        "time_to_participate": time_string}

        subject.access_code = a_code
        subject.save()
    else:
        return {"which_version": "already participated", "e_name": e_name, "pretty_name": exp.pretty_name.lower()}

    # send an email informing participants containing the access_code
    send_access_code_email(user, subject, exp)

    return {"which_version": "validate", "e_name": e_name, "pretty_name": exp.pretty_name.lower()}


def validate_access_processor(request, e_name):
    # Use the following to see if the pages produce what's expected
    # return "invalid code"
    # return "incorrect code"
    # return "no email"
    # return "participate"

    try:
        validate_access_code(request.POST.get("access_code"))
    except ValidationError:
        return "invalid code"

    # Get the validated code
    a_code=request.POST.get("access_code")

    # See if there's a participant entry with that code
    subject = None
    try:
        subject = Participant.objects.get(access_code=a_code)
    except:
        return "incorrect code"

    # check if code belongs to participant
    # get session email and then pid and verify the accesscode
    # goes with that pid
    user_email = request.session['email']
    # Create variable we'll contain the user information in
    user = None
    # Make sure there's not already a user before creating one
    try:
        user = User.objects.get(email=user_email)
        # There is a user. Check to see if the permission
        # needs changing.
    except: # The session expired or didn't exist, or there's no
        # user. Either way, redirect to the consent page to start
        # over
        return "no email"

    pid = create_participant_id(user, e_name, True)
    if(subject.participant!=pid):
        return "wrong code"

    # The user is logged in and has the correct code so let them
    # participate
    return "participate"


def validate_access_code(code_to_validate):
    return re.match(r'^[a-f0-9]{10}$', code_to_validate)


def user_exists(email):
    rawsql="""
    SELECT email, permission_to_contact
    FROM USER
    WHERE email = %s
    LIMIT 1
    """ % email
    cursor=connection.cursor()
    cursor.execute(rawsql)
    user = cursor.fetchone()
    connection.close()
    return user


def get_user_permission(email):
    # This function only makes sense to call if it's known that the user exists
    rawsql="""
    SELECT permission_to_contact
    FROM USER
    WHERE email = %s
    LIMIT 1
    """ % email
    cursor=connection.cursor()
    cursor.execute(rawsql)
    permission = cursor.fetchone()[0]
    connection.close()
    return permission


def get_participant_institution(email):
    return email.split("@")[1]  # We want the portion after the at symbol


def may_participant_participate(pid, e_name, email):
    permission_to_participate = False

    eid = get_experiment_id(e_name)

    rawsql="""
        SELECT experiments.participation_time, experiments.experiment.repeat
        FROM experiments.experiment
        LEFT JOIN experiments.experiment
        ON experiments.participants.experiment = experiments.experiment.id
        WHERE experiment = "%(eid)s"
        AND participant = %(pid)s Limit = 1
    """ % {"eid": eid, "pid": pid}
    cursor=connection.cursor()
    cursor.execute(rawsql)
    participation = cursor.fetchone()
    connection.close()

    if(participation):  # We have a row for this participant, check that they can participate again
        permission_to_participate = participation_time==0 or participation==True
    else:
        permission_to_participate = True

    return permission_to_participate


def get_experiment_id(e_name):
    rawsql="""
        SELECT id
        FROM experiments.experiment
        WHERE url_name = %s Limit = 1
    """ % e_name
    cursor = connection.cursor()
    cursor.execute(rawsql)
    eid = cursor.fetchone()[0]
    connection.close()
    return eid


def get_experiment_names(eid):
    rawsql="""
        SELECT url_name, pretty_name
        FROM experiments_experiment
        WHERE id = %s
        LIMIT 1
    """ % eid
    cursor = connection.cursor()
    cursor.execute(rawsql)
    e_names = cursor.fetchone()
    connection.close()

    if(e_names):
        return {"url_name": e_names.url_name,
                "pretty_name": e_names.pretty_name,}
    else:
        return False


def send_access_code_email(user, participant, experiment):
    sub = "Consent to participate in " + experiment.pretty_name.lower() + "."
    mes = """
Thank you for agreeing to participate in the study about
%(pretty)s.

Not only are you playing a vital role in the scientific process, you should
learn a little something about how scientists investigate the world around
them.

To participate, please enter the following code into the box you should
see after you indicated that you voluntarily consented to participate in this
study:

%(a_code)s

Thank you, again for agreeing to participate.

William H. Knapp III
Open Psychology
    """ % {"pretty": experiment.pretty_name.lower(), "a_code": participant.access_code}

    sender = '"Open Psychology"<noreply@openpsychology.org>'
    recipient = user.email

    send_mail(sub, mes, sender, [recipient], fail_silently=False)


def write_or_append(filename, data):
    if(os.path.isfile(filename)):
        # The file exists
        # get rid of the row of headers
        data = data.split("\n")
        data.pop(0)
        data = "\n".join(data)
        with open(filename, "a") as outfile:
            csv_file = File(outfile)
            csv_file.write(data)
    else:
        # The file doesn't exist
        with open(filename, "w") as outfile:
            csv_file = File(outfile)
            csv_file.write(data)
