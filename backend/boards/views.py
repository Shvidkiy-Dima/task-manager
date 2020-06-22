from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import mixins
from .models import Board, Step, Card, Invite
from .serializers import BoardSerializer, StepSerializer, CardSerializer, InviteSerializer
from .permissions import BoardPerm, StepPerm, CardPerm
from .mixins import CreateAuthorModelMixin


class BoardView(CreateAuthorModelMixin, ModelViewSet):
    serializer_class = BoardSerializer
    queryset = Board.objects.all()
    permission_classes = [IsAuthenticated, BoardPerm]

    def list(self, request, *args, **kwargs):
        personal_boards = self.request.user.board_set.all()
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

    def perform_update(self, serializer):
        position = self.request.data.get('position')
        if position:
            another_step = Step.objects.get(position=position)
            another_step.position = serializer.instance.position
            another_step.save(update_fields=['position'])
        serializer.save()


class CardView(CreateAuthorModelMixin,
               mixins.RetrieveModelMixin,
               mixins.UpdateModelMixin,
               mixins.DestroyModelMixin,
               GenericViewSet):
    serializer_class = CardSerializer
    queryset = Card.objects.all()
    permission_classes = [IsAuthenticated, CardPerm]


class InviteView(mixins.CreateModelMixin,
                 mixins.RetrieveModelMixin,
                 GenericViewSet):
    serializer_class = InviteSerializer
    queryset = Invite.objects.all()
    permission_classes = [IsAuthenticated, StepPerm]

    def retrieve(self, request, pk):
        invite =  Invite.objects.get(pk=pk)
        invite.board.participants.add(request.user)
        invite.delete()
        return Response({'STATUS': 'OK'})
