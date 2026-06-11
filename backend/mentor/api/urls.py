from django.urls import path
from . import views
urlpatterns = [
    path('upload_frame/', views.upload_frame, name='upload_frame'),
]