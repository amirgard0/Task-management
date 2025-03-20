from django.urls import path
from . import views as v

urlpatterns = [
    path('register', v.RegisterView.as_view(), name="register"),
    path('login', v.Loginview.as_view(), name="login"),
    path('logout', v.LogoutView.as_view(), name = "logout")
]