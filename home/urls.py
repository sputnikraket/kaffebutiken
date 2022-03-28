from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name='main'),
    path('login/', views.loginpage, name='login'),
    path('register/', views.register, name='reg'),
    path('newevent/', views.newevent, name='newevent'),
    path('event/', views.showevent, name='event'),
    path('payment/', views.goToPayment, name='goToPayment'),
]