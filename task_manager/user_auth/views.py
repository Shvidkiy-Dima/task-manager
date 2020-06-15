from django.views import View
from django.http.response import JsonResponse

class TestView(View):

    def get(self, req):
        req.session['test2'] = 12
        req.session['test3'] = 12
        return JsonResponse({'test': req.session['test']})