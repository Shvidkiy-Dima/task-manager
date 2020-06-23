from rest_framework.serializers import ModelSerializer, HyperlinkedIdentityField, SerializerMethodField
from .models import Board, Step, Card, Invite
from user_auth.serializers import BoardUserSerializer

class CardSerializer(ModelSerializer):
    author = BoardUserSerializer(read_only=True)

    class Meta:
        model = Card
        fields = ['id', 'title', 'body', 'author', 'current_step', 'creation_date']


class StepSerializer(ModelSerializer):

    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model = Step
        fields = ['id', 'title', 'board', 'cards', 'position']


class BoardSerializer(ModelSerializer):
    has_perm = SerializerMethodField()
    steps = StepSerializer(many=True, read_only=True)
    participants = BoardUserSerializer(many=True, read_only=True)
    author = BoardUserSerializer(read_only=True)

    def get_has_perm(self, obj):
        return self._context['request'].user == obj.author

    class Meta:
        model = Board
        fields = ['id', 'title', 'author', 'steps', 'participants', 'has_perm']


class InviteSerializer(ModelSerializer):
    link = HyperlinkedIdentityField('boards:invite-detail')

    class Meta:
        model = Invite
        fields = ['link', 'board']
