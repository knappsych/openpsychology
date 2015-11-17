from django.shortcuts import render_to_response
from django.views.decorators.http import require_http_methods
from experiments.experiments import *
from experiments.models import Experiment
from experiments.debriefing import validate_experimental_data
from openpsy.openpsy import verify_and_send_email_form


def index_view(request):
    return render_to_response('base.html', {'page_title': 'Welcome to Open Psychology!'})


def about_view(request):
    return render_to_response('about.html', {'page_title': 'About Open Psychology'})


def contact_view(request):
    c = verify_and_send_email_form(request, 'Contact Open Psychology', 'william@openpsychology.org')
    c.update(csrf(request))
    return render_to_response('contact.html', c)


def experiment_list_view(request):
    c = experiment_list_view_context()
    return render_to_response('experiments.html', c)


def consent_view(request, e_name):
    c = consent_view_context(request, e_name)
    return render_to_response(e_name + "/consent.html", c)


@require_http_methods(["POST"])
def validate_view(request, e_name):
    c = validate_view_processor(request, e_name)
    c.update(csrf(request))
    return render_to_response(e_name + "/validate.html", c)


@require_http_methods(["POST"])
def participate_view(request, e_name):
    which_version = validate_access_processor(request, e_name)
    c = {"which_version": which_version, "e_name": e_name}
    c.update(csrf(request))
    return render_to_response(e_name + "/participate.html", c)


def debriefing_view(request, e_name):
    c = validate_experimental_data(request, e_name)
    return render_to_response(e_name + "/debriefing.html", c)


def inquiry_view(request, e_name):
    exp = Experiment.objects.get(url_name=e_name)
    pi = exp.pi
    c = verify_and_send_email_form(request, 'Contact the primary investigator for ' + exp.pretty_name, pi.email)
    c["pretty_name"] = exp.pretty_name.lower()
    c["pi_name"] = pi.first_name + " " + pi.last_name
    c.update(csrf(request))
    return render_to_response(e_name + "/inquiry.html", c)


def ethics_view(request, e_name):
    exp = Experiment.objects.get(url_name=e_name)
    irb = exp.institution
    c = verify_and_send_email_form(request, 'Contact the IRB Chair for ' + exp.pretty_name, irb.irb_chair_email)
    c["pretty_name"] = exp.pretty_name.lower()
    c["irb_name"] = irb.irb_chair_name
    c.update(csrf(request))
    return render_to_response(e_name + "/ethics.html", c)
