from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    
    def __str__(self):
        return self.username

class Comments(models.Model):
    text = models.TextField(max_length=256)
    user = models.ForeignKey("User", on_delete= models.CASCADE, related_name="comments")
    
    def serialize(self):
        return {
            "text": self.text,
            "user":self.user.username
        }

class Post(models.Model):
    text = models.TextField(max_length=256, null=True)
    user = models.ForeignKey("User", on_delete= models.CASCADE, related_name="posts")
    time = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    comments = models.ManyToManyField("Comments")
    whoLiked = models.ManyToManyField("User", related_name= "likes")

    def serialize(self):
        return {
            "text": self.text,
            "user":self.user.username,
            "comments":[comment.serialize() for comment in self.comments.all()],
            "time": self.time.strftime(f'%b %d %Y, %I:%M %p'),
            "likes": self.likes,
            "id": self.id
        }

class UserFollowing(models.Model):
    user_id = models.ForeignKey("User", related_name="following", on_delete= models.CASCADE)
    following_user_id = models.ForeignKey("User", related_name="followers", on_delete= models.CASCADE)

    