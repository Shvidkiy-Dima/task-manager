from rest_framework.viewsets import ModelViewSet
from .models import BoardUser
from .serializers import BoardUserSerializer

class BoardUserView(ModelViewSet):
    serializer_class = BoardUserSerializer
    queryset = BoardUser.objects.all()