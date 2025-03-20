from django.db import models

# BaseTask is now an abstract model
class BaseTask(models.Model):
    id = models.AutoField(primary_key=True)  # Explicitly define the primary key
    name = models.CharField(max_length=100)
    is_done = models.BooleanField(default=False)

    class Meta:
        abstract = True  # This ensures BaseTask does not create its own table

# NormalTask inherits from BaseTask
class NormalTask(BaseTask):
    user = models.ManyToManyField("authentication.User", related_name='tasks')

# Project model
class Project(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    creator = models.ForeignKey("authentication.User", on_delete=models.CASCADE, related_name="creations", blank=False)
    description = models.TextField()
    dead_line = models.DateField()
    users = models.ManyToManyField("authentication.User", related_name="projects")
    
    def __str__(self):
        return self.name

# ProjectTask inherits from BaseTask
class ProjectTask(BaseTask):
    project = models.ForeignKey(Project, related_name='tasks', on_delete=models.CASCADE)