from django.db import models
from django.contrib.auth import get_user_model


class Board(models.Model):
    board_name = models.CharField(max_length=64, null=False, blank=False)
    owner = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='my_boards')
    participants = models.ManyToManyField(get_user_model(), related_name='all_boards')
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.participants.add(self.owner)


class Step(models.Model):
    step_name = models.CharField(max_length=64, null=False, blank=False)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='steps')


class Card(models.Model):
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    title = models.CharField(max_length=124, null=False, blank=False)
    body = models.CharField(max_length=1024, null=False, blank=False)
    current_step = models.ForeignKey(Step, on_delete=models.CASCADE, related_name='cards')
