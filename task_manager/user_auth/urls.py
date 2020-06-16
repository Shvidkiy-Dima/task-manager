from rest_framework.routers import SimpleRouter
from .views import BoardUserView

router = SimpleRouter()

router.register(r'user', BoardUserView)

urlpatterns = router.urls