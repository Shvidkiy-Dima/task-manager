from rest_framework.serializers import ModelSerializer
from .models import Board, Step, Card


class CardSerializer(ModelSerializer):

    class Meta:
        model = Card
        fields = ['id', 'title', 'body', 'author', 'current_step']


class StepSerializer(ModelSerializer):

    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model = Step
        fields = ['id', 'step_name', 'board', 'cards']


class BoardSerializer(ModelSerializer):
    steps = StepSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = ['id', 'board_name', 'owner', 'steps']
