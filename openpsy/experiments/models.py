from django.db import models
from django.forms import ModelForm


#From: http://stackoverflow.com/questions/849142/how-to-limit-the-maximum-value-of-a-numeric-field-in-a-django-model
class IntegerRangeField(models.IntegerField):
    def __init__(self, verbose_name=None, name=None, min_value=None, max_value=None, **kwargs):
        self.min_value, self.max_value = min_value, max_value
        models.IntegerField.__init__(self, verbose_name, name, **kwargs)
    def formfield(self, **kwargs):
        defaults = {'min_value': self.min_value, 'max_value':self.max_value}
        defaults.update(kwargs)
        return super(IntegerRangeField, self).formfield(**defaults)


# Create your models here.
class Institution(models.Model):
    institution_name = models.CharField(max_length=100, unique=True)
    zip_code = IntegerRangeField(min_value=1, max_value=99999, default=99999)
    irb_chair_name = models.CharField(max_length=100)
    irb_chair_email = models.EmailField()

    def __str__(self):
        return self.institution_name


class PrimaryInvestigator(models.Model):
    first_name = models.CharField(max_length=60)
    last_name = models.CharField(max_length=80)
    email = models.EmailField(unique=True)
    institution = models.ForeignKey(Institution)

    def __str__(self):
        return self.first_name + " " + self.last_name


class InfoTag(models.Model):
    tag_text = models.CharField(max_length=60)

    def __str__(self):
        return self.tag_text


class Experiment(models.Model):
    DELAY_UNIT_CHOICES = (
        ("hours", "hours"),
        ("days", "days"),
        ("months", "months"),
        ("years", "years"),
    )
    url_name = models.CharField("URL accessible location", max_length=20)
    pretty_name = models.CharField(max_length=60)
    description = models.CharField(max_length=140)
    pi = models.ForeignKey(PrimaryInvestigator)
    institution = models.ForeignKey(Institution)
    tag = models.ManyToManyField(InfoTag)
    start_date = models.DateField()
    end_date = models.DateField()
    repeat = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    repeat_delay = models.IntegerField(default=0)
    repeat_delay_units = models.CharField(max_length=5,
                                          choices=DELAY_UNIT_CHOICES,
                                          default="days")

    def __str__(self):
        return self.pretty_name


class User(models.Model):
    email = models.EmailField(unique=True)
    permission_to_contact = models.BooleanField(default=True)
    def __str__(self):
        return self.pretty_name


class UserForm(ModelForm):
    class Meta:
        model = User
        fields = ['permission_to_contact', 'email']


class Participant(models.Model):
    participant = models.CharField(max_length=32)
    experiment = models.ForeignKey(Experiment)
    institution = models.CharField(max_length=64)
    participation_time = models.IntegerField(default=0)
    time_last_participated = models.DateTimeField(auto_now=True)
    access_code = models.CharField(max_length=10, default="ZZZZZZZZZZ")


