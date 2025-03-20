from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView, GenericAPIView
from .models import Project, NormalTask, ProjectTask
from .serializers import ProjectSerializer, ProjectTaskSerializer, NormalTaskSerializer, UserSerializer
from rest_framework.response import Response
from django.http import HttpRequest
from rest_framework import status
from authentication.models import User
from django.http import Http404

class UserGet(RetrieveAPIView):
    queryset = User.objects.all()
    lookup_field = "id"
    
    def get(self, request, *args, **kwargs):
        user = self.get_object()
        return Response(user.username)
    
class SelfUserGet(GenericAPIView):
    queryset = User.objects.all()
    
    def get(self, request, *args, **kwargs):
        user = request.user
        return Response(UserSerializer(user).data)
    
#region Project about

#region project

class ProjectRetriveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = "id"
    
    def perform_update(self, serializer):
        serializer.save()
    
    def update(self, request, *args, **kwargs):
        try:
            project_id = self.kwargs.get('id')
            if not Project.objects.filter(id=project_id).exists():
                return Response({"detail": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
            
            instance = self.get_object()
            if instance.creator != request.user:
                return Response({"detail": "You are not the creator"}, status=status.HTTP_403_FORBIDDEN)
            
            serializer = self.get_serializer(instance, data=request.data, partial=kwargs.pop('partial', False))
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            if getattr(instance, '_prefetched_objects_cache', None):
                instance._prefetched_objects_cache = {}

            return Response(serializer.data)
        except Http404:
            return Response({"detail": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def check_permissions(self, request):
        if request.user in self.get_object().users.all() or self.get_object().creator == request.user:
            return super().check_permissions(request)
        self.permission_denied(request=request, message="This project is not in your projects")

class ProjectCreateListView(ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def perform_create(self, serializer:ProjectSerializer):
        serializer.validated_data["creator_id"] = self.request.user.id
        return super().perform_create(serializer)

    def get(self, request: HttpRequest, *args, **kwargs):
        self.queryset = request.user.projects.all() | request.user.creations.all()
        return super().get(request, *args, **kwargs)
#endregion /project

#region ProjectTask

class ProjectTaskListCreateView(ListCreateAPIView):
    serializer_class = ProjectTaskSerializer
    
    def get_queryset(self):
        project_id = self.kwargs.get('id')
        return ProjectTask.objects.filter(project_id=project_id)

    def get(self, request, *args, **kwargs):
        project_id = self.kwargs.get('id')
        if not Project.objects.filter(id=project_id).exists():
            return Http404("project not found")
        return super().get(request, *args, **kwargs)

    def perform_create(self, serializer):
        project_id = self.kwargs.get('id')

        project = Project.objects.get(id=project_id)
        serializer.save(project=project)

    def check_permissions(self, request):
        project_id = self.kwargs.get('id')
        if not Project.objects.filter(id=project_id).exists():
            return Http404("project not found")
        if request.user in Project.objects.get(id=project_id).users.all() or Project.objects.get(id=project_id).creator == request.user:
            return super().check_permissions(request)
        self.permission_denied(request=request, message="This project is not in your projects")

class ProjectTaskUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectTaskSerializer
    lookup_field = "id"

    def get_queryset(self):
        project_id = self.kwargs.get("id")
        return ProjectTask.objects.filter(project_id=project_id)

    def get_object(self):
        task_id = self.kwargs.get("task_id")
        queryset = self.get_queryset()
        try:
            return queryset.get(id=task_id)
        except ProjectTask.DoesNotExist:
            return Http404("this project doesn't have this taks")

#endregion /ProjectTask

#endregion

#region NormalTask
class NormalTaskListCreateView(ListCreateAPIView):
    serializer_class = NormalTaskSerializer
    
    def get_queryset(self):
        return NormalTask.objects.filter(user=self.request.user.id)
    
    def perform_create(self, serializer: NormalTaskSerializer):
        instance = serializer.save()
        self.request.user.tasks.add(instance)


class NormalTaskUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = NormalTaskSerializer
    lookup_field="id"
    
    def get_queryset(self):
        return NormalTask.objects.filter(user=self.request.user.id)
#endregion /NormalTask