from django.conf.urls import url
from experiments.views import *

__author__ = 'wknapp'

urlpatterns = [
    #Just get the index of the experiments
    url(r'^$', experiment_list_view, name="experiments"),
    url(r'^(?P<e_name>[a-zA-Z][a-zA-Z0-9_]{0,19})/$', consent_view),
    url(r'^(?P<e_name>[a-zA-Z][a-zA-Z0-9_]{0,19})/consent/$', consent_view, name="consent"),
    url(r'^(?P<e_name>[a-zA-Z][a-zA-Z0-9_]{0,19})/validate/$', validate_view, name="validate"),
    url(r'^(?P<e_name>[a-zA-Z][a-zA-Z0-9_]{0,19})/participate/$', participate_view, name="participate"),
    url(r'^(?P<e_name>[a-zA-Z][a-zA-Z0-9_]{0,19})/debriefing/$', debriefing_view, name="debriefing"),
    url(r'^(?P<e_name>[a-zA-Z][a-zA-Z0-9_]{0,19})/results/$', results_view, name="results"),
    url(r'^(?P<e_name>[a-zA-Z][a-zA-Z0-9_]{0,19})/inquiry/$', inquiry_view, name="inquiry"),
    url(r'^(?P<e_name>[a-zA-Z][a-zA-Z0-9_]{0,19})/ethics/$', ethics_view, name="ethics"),
]
