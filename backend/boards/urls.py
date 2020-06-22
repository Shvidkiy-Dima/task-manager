from rest_framework.routers import SimpleRouter
from .views import BoardView, CardView, StepView, InviteView


app_name = 'boards'

router = SimpleRouter()

router.register(r'boards', BoardView)
router.register(r'steps', StepView)
router.register(r'cards', CardView)
router.register(r'invite', InviteView)

urlpatterns = router.urls
