from os import link
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
#from wsproto import events

class Event(models.Model):  
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    #other fields here
    link = models.TextField(default=0)
    data = models.TextField(default=0)
    titel = models.TextField(default=0)
    description = models.TextField(default=0)

class Field(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE) 
    position = models.TextField(default=0)
    titel = models.TextField(default=0)
    description = models.TextField(default=0)
    type = models.TextField(default=0)
    answer = models.TextField(default=0)
    reqornot = models.BooleanField()
