from django.urls import path
from .views import *

urlpatterns = [
    path("getUser/<int:id>/", UserGet.as_view(), name="id to username"),
    path("getUser/", SelfUserGet.as_view(), name="self user"),
    path('projects/', ProjectCreateListView.as_view(), name='project list view'),
    path("projects/<int:id>/", ProjectRetriveUpdateDestroyView.as_view(), name="project view"),
    path("projects/<int:id>/tasks/", ProjectTaskListCreateView.as_view(), name="Project task list view"),
    path("projects/<int:id>/tasks/<int:task_id>/", ProjectTaskUpdateDestroyView.as_view(), name="Project task view"),
    path("tasks/", NormalTaskListCreateView.as_view(), name="normal task"),
    path("tasks/<int:id>/", NormalTaskUpdateDestroyView.as_view(), name="normal task")
]
