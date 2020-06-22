from rest_framework.permissions import BasePermission
from .models import Step, Board


class BoardPerm(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return request.user in obj.participants.all()

        return request.user == obj.author


class StepPerm(BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return request.user in obj.board.participants.all()

        return request.user == obj.board.author

    def has_permission(self, request, view):
        if request.method in ['POST', 'DELETE', 'PUT', 'PATCH']:
            board_id = request.data['board']
            board = Board.objects.get(pk=int(board_id))
            return request.user == board.author

        return True


class CardPerm(BasePermission):

    def has_permission(self, request, view):
        if request.method == 'POST':
            step_id = request.data['current_step']
            step = Step.objects.get(pk=int(step_id))
            return request.user in step.board.participants.all()

        return True

    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return request.user in obj.current_step.board.participants.all()

        return request.user == obj.current_step.board.author or request.user == obj.author
