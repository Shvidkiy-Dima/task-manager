from rest_framework import mixins
from user_auth.serializers import BoardUserSerializer

class CreateAuthorModelMixin(mixins.CreateModelMixin):

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
