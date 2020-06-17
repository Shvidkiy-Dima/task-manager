from rest_framework.routers import SimpleRouter
from .views import BoardView, CardView, StepView

router = SimpleRouter()

router.register(r'boards', BoardView)
router.register(r'steps', StepView)
router.register(r'cards', CardView)

urlpatterns = router.urls
