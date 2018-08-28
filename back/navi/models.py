from django.db import models


class Subject(models.Model):
    name = models.CharField(max_length=100)
    subject_code = models.CharField(max_length=20)
    lon = models.FloatField(default=0)
    lat = models.FloatField(default=0)
    icon = models.IntegerField(default=0)
    extra = models.CharField(max_length=1000, default="")

    def __str__(self):
        return self.subject_code + ":" + self.name


class History(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)
    lon = models.FloatField(default=0)
    lat = models.FloatField(default=0)
    extra = models.CharField(max_length=1000, default="")

    def subject_code(self):
        return self.subject.subject_code

    def subject_id(self):
        return self.subject.id

    def subject_icon(self):
        return self.subject.icon

