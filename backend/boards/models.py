import uuid
from django.db import models
from django.contrib.auth import get_user_model
from .model_mixins import BaseBoard


class Board(BaseBoard):
    participants = models.ManyToManyField(get_user_model(), related_name='all_boards')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.steps.bulk_create([
            Step(title='To do', board=self, position=0),
            Step(title='In progress', board=self, position=1),
            Step(title='Done', board=self, position=2),
        ])
        self.participants.add(self.author)


class Step(BaseBoard):

    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='steps')
    position = models.IntegerField(default=lambda: Step.objects.order_by('position').last().position + 1)



    @property
    def author(self):
        return self.board.author


class Card(BaseBoard):
    body = models.CharField(max_length=1024, null=False, blank=False)
    current_step = models.ForeignKey(Step, on_delete=models.CASCADE, related_name='cards')


class Invite(models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    link = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
