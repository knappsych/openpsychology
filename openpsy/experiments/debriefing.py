import os
import zipfile
from shutil import copyfile
from django.core.mail import EmailMultiAlternatives
from experiments.models import User, Experiment, Participant
from experiments.experiments import create_participant_id, write_or_append
from django.utils import timezone
from openpsy.settings import STATICFILES_DIRS
__author__ = 'wknapp'


def get_debriefing_text(e_name):
    e = Experiment.objects.get(url_name=e_name)
    if e_name == "ior01":
        the_text = ' <p>Thank you for participating in ' + e.pretty_name + '.</p>' + '''
        <p>Many things can grab our attention (e.g. a flash of light: Posner & Cohen, 1984,
        or the onset of motion: Abrams & Christ, 2003). But what happens after such
        an event has exogenously captured our attention. The work of Posner & Cohen, 1984
        indicated that it depends. Shortly after an irrelevant even appears, participants
        are faster to respond to the target box when it appears in the location that
        briefly changed. At a longer delay, however, participants are faster to respond
        to the target box, when it appears in the non-flashed box. This phenomenon is
        known as inhibition of return, because participants are inhibited from detecting
        the target event when it appears in the cued (i.e. briefly brightened location</p>

        <p>References</p>
        <ol>
        <li>Abrams, R. A., & Christ, S. E. (2003). Motion onset captures attention. Psychological
        Science, 14, 427-432. doi: 10.1111/1467-9280.01458</li>

        <li>Posner, M. I., & Cohen, Y. (1984). Components of visual orienting. In H.
        Bouma & D. G. Bouwhuis (Eds), Attention and Performance X, (pp. 531-556),
        Hillsdale, NJ: Earlbaum.</li>
        </ol>
        '''
    elif e_name == "studsuccess01":
        the_text = ' <p>Thank you for participating in ' + e.pretty_name + '.</p>' + '''
        <p>Choosing to accept a smaller reward now than a larger reward after some delay is known
        as delay, or temporal, discounting. The idea is that the larger future amount is discounted
        for earlier access to the rewarding stimulus (e.g. money or food). When the discounting
        rate is high, people will accept much smaller amounts compared to when the discounting rate
        is low. Someone who didn't discount at all would only accept the full amount and not a penny
        less for earlier access.</p>

        <p>Delay discounting is often thought to index impulsivity as accepting a smaller reward now
        reflects an impulse for immediate gratification over delayed gratification. Supporting this
        idea, drug addicts are likely to have greater discounting rates than non addicts (Kirby,
        Petry, & Bickel, 1999). Similarly obese women, have higher discounting rates than their
        healthy weight counterparts (Weller, Cook, Avsar, & Cox, 2008)</p>

        <p>Although discounting has been shown to correlate with self-reported grades (Freeney &
        O'Connell, 2010) and current GPA (Kirby, Winston, & Santiesteban, 2005), no one has
        examined whether discounting rates in college students predict later academic outcomes
        (e.g. grades or time to degree). The primary purpose of this study is to fill that gap by
        measuring your discounting rates today and tracking your future academic performance.</p>

        <p>Although discounting has been linked with measures of socioeconomic status (i.e. SES;
        e.g. Yamane, Takahashi, Kamesaka, Tsutsui, & Ohtake, 2013; or Sweitzer et al., 2013),
        this study further explores the relationship between discounting and SES through current
        and past financial security. By accounting for both discounting and financial security,
        it could be identified whether both factors independently predict academic outcomes. Such
        information could be valuable to institutions looking to help at risk students.</p>

        <p>References</p>
        <ol>
        <li>Freeney, Y., & O'Connell, M. (2010). Wait for it: Delay-discounting and academic performance
        among an Irish adolescent sample. Learning and Individual Differences, 20, 231-236. doi:
        10.1016/j.lindif.2009.12.009</li>

        <li>Kirby, K. N., Petry, N. M., & Bickel, W. K. (1999). Heroin have higher discount rates
        for delayed rewards than non-drug using controls. Journal of Experimental Psychology:General,
        128, 78-87. doi: 10.1037/0096-3445.128.1.78</li>

        <li>Kirby, K. N., Winston, G. C., & Santiesteban, M. (2005). Impatience and grades:
        Delay-discount rates correlate negatively with college GPA. Learning and Individual
        Differences, 15, 213-222. doi: 10.1016/j.lindif.2005.01.003</li>

        <li>Sweitzer, M. M., Halder, I., Flory, J. D., Craig, A. E., Gianaros, P. J., Ferrell,
        R. E., & Manuck, S. B. (2013). Polymorphic variation in the dopamine D4 receptor predicts
        delay discounting as a function of childhood socioeconomic status: evidence for differential
        susceptibility. Social Cognitive and Affective Neuroscience, 8, 499-508. doi:
        10.1093/scan/nss020</li>

        <li>Weller, R. E. Cook, E. W., III, Avsar, K. B., & Cox, J. E. (2008). Obese women show
        greater delay discounting than healthy-weight women. Appetite, 51, 563-569. doi:
        10.1016/j.appet.2008.04.010</li>
        </ol>
        '''
    return the_text



def validate_experimental_data(request, e_name):
    if e_name == "ior01":
        exp = Experiment.objects.get(url_name=e_name)
        debriefing = get_debriefing_text(e_name)
        demo_data = None
        ior01_data = None
        which_version = None
        try:
            demo_data = request.POST.get("demo_data", "this is it")
        except:
            return {"which_version": "no data", "e_name": e_name, "pretty_name": exp.pretty_name,
                "debriefing": debriefing}

        try:
            ior01_data = request.POST.get("ior01_data", "this is it")
        except:
            return {"which_version": "no data", "e_name": e_name, "pretty_name": exp.pretty_name,
                "debriefing": debriefing}

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
        except:  # The session expired or didn't exist, or there's no
            # user. Either way, redirect to the consent page to start
            # over
            return {"which_version": "no email", "e_name": e_name, "pretty_name": exp.pretty_name,
                "debriefing": debriefing}

        pid = create_participant_id(user, e_name, True)

        # Replace the pid placeholders in the data with the real pids
        demo_data = demo_data.replace("domain_id", user.email.split("@")[1])
        demo_data = demo_data.replace("pid", pid)
        ior01_data = ior01_data.replace("pid", pid)

        # Get the participant and update their participation information
        try:
            subject = Participant.objects.get(participant=pid, experiment=exp)
        except:
            return {"which_version": "no participant", "e_name": e_name, "pretty_name": exp.pretty_name,
                "debriefing": debriefing}

        #Stop resubmitted forms from writing and emailing again and again.
        resubmit = request.session.get('submitted')
        if resubmit != e_name:
            request.session['submitted'] = e_name

            #Only update the participation time once.
            subject.participation_time = subject.participation_time + 1
            subject.access_code = "ZZZZZZZZZZ"
            subject.time_last_participated = timezone.now()
            # ZZZZZZZZZZ won't validate as an access code because it should match the regex [a-f0-9]{10}
            subject.save()

            # Write to the file
            demo_filename = e_name + '_demo.csv'
            ior_filename = e_name + '_ior.csv'

            basefile = os.path.dirname(os.path.abspath(__file__)) + '/templates/' + e_name
            demo_file = basefile + '/' + demo_filename
            ior_file = basefile + '/' + ior_filename
            demo_data = demo_data.replace("<br>", "\n")
            ior01_data = ior01_data.replace("<br>", "\n")

            write_or_append(demo_file, demo_data)
            write_or_append(ior_file, ior01_data)

            #Zip the files into one zipped source
            os.chdir(basefile)
            #zfile_name = os.path.join(basefile, 'experiments/templates/' + e_name + '/' + e_name + '.zip')
            zfile_name = basefile + '/' + e_name + '.zip'
            zf = zipfile.ZipFile(zfile_name, mode="w")
            zf.write(demo_filename)
            zf.write(ior_filename)
            zf.close()

            #Copy the zipfile to the static directory
            #copyfile(zfile_name, os.path.join(STATICFILES_DIRS[0], 'static/experiments/' + e_name + '/' + e_name + '.zip'))
            copyfile(zfile_name, os.path.join(STATICFILES_DIRS[0], e_name + '/' + e_name + '.zip'))

            # email debriefing
            email_body = debriefing + '''
                <h2>Want to learn more?</h2>
                <p>
                    Contact the primary investigator, ''' + exp.pi.first_name + ' ' + exp.pi.last_name + '''
                    at ''' + exp.pi.email + '''.
                </p>

                <h2>Do you have ethical concerns?</h2>
                <p>
                    Contact the chair of the institutional review board for this study, ''' + exp.institution.irb_chair_name + '''
                    at ''' + exp.institution.irb_chair_email + '''.
                </p>'''

            email_subject = 'Thanks for participating in ' + exp.pretty_name + '!'
            msg = EmailMultiAlternatives(email_subject, email_body, '"Open Psychology"<noreply@openpsychology.org>', [user.email])
            msg.attach_alternative(email_body, "text/html")
            msg.send()
            #send_mail(email_subject,email_body,'noreply@openpsychology.org', [user.email], fail_silently=False)

            subject.participation_time = subject.participation_time+1
            subject.time_last_participated = timezone.now()
            subject.save()

    elif e_name == "studsuccess01":
        exp = Experiment.objects.get(url_name=e_name)
        debriefing = get_debriefing_text(e_name)
        demo_data = None
        security_data = None
        discount_data = None
        which_version = None
        try:
            demo_data = request.POST.get("demo_data", "this is it")
        except:
            return {"which_version": "no data", "e_name": e_name, "pretty_name": exp.pretty_name,
                "debriefing": debriefing}

        try:
            security_data = request.POST.get("security_data", "this is it")
        except:
            return {"which_version": "no data", "e_name": e_name, "pretty_name": exp.pretty_name,
                "debriefing": debriefing}

        try:
            discount_data = request.POST.get("discount_data", "this is it")
        except:
            return {"which_version": "no data", "e_name": e_name, "pretty_name": exp.pretty_name,
                "debriefing": debriefing}

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
        except:  # The session expired or didn't exist, or there's no
            # user. Either way, redirect to the consent page to start
            # over
            return {"which_version": "no email", "e_name": e_name, "pretty_name": exp.pretty_name,
                "debriefing": debriefing}

        pid = create_participant_id(user, e_name, True)

        # Replace the pid placeholders in the data with the real pids
        demo_data = demo_data.replace("domain_id", user.email.split("@")[1])
        demo_data = demo_data.replace("pid", pid)
        security_data = security_data.replace("pid", pid)
        discount_data = discount_data.replace("pid", pid)

        # Get the participant and update their participation information
        try:
            subject = Participant.objects.get(participant=pid, experiment=exp)
        except:
            return {"which_version": "no participant", "e_name": e_name, "pretty_name": exp.pretty_name,
                "debriefing": debriefing}

        #Stop resubmitted forms from writing and emailing again and again.
        resubmit = request.session.get('submitted')
        if resubmit != e_name:
            request.session['submitted'] = e_name

            #Only update the participation time once.
            subject.participation_time = subject.participation_time + 1
            subject.access_code = "ZZZZZZZZZZ"
            subject.time_last_participated = timezone.now()
            # ZZZZZZZZZZ won't validate as an access code because it should match the regex [a-f0-9]{10}
            subject.save()

            # Write to the file
            demo_filename = e_name + '_demo.csv'
            security_filename = e_name + '_security.csv'
            discount_filename = e_name + '_discount.csv'

            basefile = os.path.dirname(os.path.abspath(__file__)) + '/templates/' + e_name
            demo_file = basefile + '/' + demo_filename
            security_file = basefile + '/' + security_filename
            discount_file = basefile + '/' + discount_filename
            demo_data = demo_data.replace("<br>", "\n")
            security_data = security_data.replace("<br>", "\n")
            discount_data = discount_data.replace("<br>", "\n")

            write_or_append(demo_file, demo_data)
            write_or_append(security_file, security_data)
            write_or_append(discount_file, discount_data)

            #Zip the files into one zipped source
            os.chdir(basefile)
            #zfile_name = os.path.join(basefile, 'experiments/templates/' + e_name + '/' + e_name + '.zip')
            zfile_name = basefile + '/' + e_name + '.zip'
            zf = zipfile.ZipFile(zfile_name, mode="w")
            zf.write(demo_filename)
            zf.write(security_filename)
            zf.write(discount_filename)
            zf.close()
            
            #Copy the zipfile to the static directory
            #copyfile(zfile_name, os.path.join(STATICFILES_DIRS[0], 'static/experiments/' + e_name + '/' + e_name + '.zip'))
            copyfile(zfile_name, os.path.join(STATICFILES_DIRS[0], e_name + '/' + e_name + '.zip'))

            # email debriefing
            email_body = debriefing + '''
                <h2>Want to learn more?</h2>
                <p>
                    Contact the primary investigator, ''' + exp.pi.first_name + ' ' + exp.pi.last_name + '''
                    at ''' + exp.pi.email + '''.
                </p>

                <h2>Do you have ethical concerns?</h2>
                <p>
                    Contact the chair of the institutional review board for this study, ''' + exp.institution.irb_chair_name + '''
                    at ''' + exp.institution.irb_chair_email + '''.
                </p>'''

            email_subject = 'Thanks for participating in ' + exp.pretty_name + '!'
            msg = EmailMultiAlternatives(email_subject, email_body, '"Open Psychology"<noreply@openpsychology.org>', [user.email])
            msg.attach_alternative(email_body, "text/html")
            msg.send()
            #send_mail(email_subject,email_body,'noreply@openpsychology.org', [user.email], fail_silently=False)

            subject.participation_time = subject.participation_time+1
            subject.time_last_participated = timezone.now()
            subject.save()

    return {"which_version": "debrief", "e_name": e_name, "pretty_name": exp.pretty_name,
            "debriefing": debriefing}
