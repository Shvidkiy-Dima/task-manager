from django.db import models
from django.contrib.auth import get_user_model


class Board(models.Model):
    name = models.CharField(max_length=64, null=False, blank=False)
    owner = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='owner')
    participants = models.ManyToManyField(get_user_model())


class Step(models.Model):
    name = models.CharField(max_length=64, null=False, blank=False)
    board = models.ForeignKey(Board, on_delete=models.CASCADE,
                              related_name='cards', related_query_name='cards')


class Card(models.Model):
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    title = models.CharField(max_length=124, null=False, blank=False)
    body = models.CharField(max_length=1024, null=False, blank=False)
    current_step = models.ForeignKey(Step, on_delete=models.CASCADE)

