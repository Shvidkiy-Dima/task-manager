from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import mixins
from .models import Board, Step, Card
from .serializers import BoardSerializer, StepSerializer, CardSerializer
from .permissions import BoardPerm, StepPerm, CardPerm


class BoardView(ModelViewSet):
    serializer_class = BoardSerializer
    queryset = Board.objects.all()
    permission_classes = [IsAuthenticated, BoardPerm]

    def list(self, request, *args, **kwargs):
        personal_boards = self.request.user.my_boards.all()
        all_boards = self.request.user.all_boards.all()
        personal_boards = self.get_serializer(personal_boards, many=True).data
        all_boards = self.get_serializer(all_boards, many=True).data
        return Response({'all_boards': all_boards, 'personal_boards': personal_boards})


class StepView(mixins.CreateModelMixin,
               mixins.UpdateModelMixin,
               mixins.DestroyModelMixin,
               GenericViewSet):
    serializer_class = StepSerializer
    queryset = Step.objects.all()
    permission_classes = [IsAuthenticated, StepPerm]


class CardView(mixins.CreateModelMixin,
               mixins.RetrieveModelMixin,
               mixins.UpdateModelMixin,
               mixins.DestroyModelMixin,
               GenericViewSet):
    serializer_class = CardSerializer
    queryset = Card.objects.all()
    permission_classes = [IsAuthenticated, CardPerm]

