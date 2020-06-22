from rest_framework.serializers import ModelSerializer
from .models import BoardUser


class BoardUserSerializer(ModelSerializer):
    class Meta:
        model = BoardUser
        fields = ['id', 'username']
