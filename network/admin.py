from django.contrib import admin
from .models import User, Comments, Post, UserFollowing

# Register your models here.
admin.site.register(User)
admin.site.register(Comments)
admin.site.register(Post)
admin.site.register(UserFollowing)
