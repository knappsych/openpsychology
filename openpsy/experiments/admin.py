from django.contrib import admin
from .models import Institution, PrimaryInvestigator, Experiment, InfoTag, Participant

# Register your models here.


class ExperimentPIInline(admin.StackedInline):
    model = Experiment


class PrimaryInvestigatorAdmin(admin.ModelAdmin):
    inlines = [ExperimentPIInline]


class ExperimentInstitutionInline(admin.StackedInline):
    model = Experiment


admin.site.register(Experiment)
admin.site.register(PrimaryInvestigator, PrimaryInvestigatorAdmin)
admin.site.register(Institution)
admin.site.register(InfoTag)
admin.site.register(Participant)