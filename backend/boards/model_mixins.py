from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone


class BaseBoard(models.Model):

    creation_date = models.DateTimeField(default=timezone.now)
    title = models.CharField(max_length=64, null=False, blank=False)
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    class Meta:
        abstract = True
