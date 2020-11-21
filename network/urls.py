
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    #api
    path("delete_post", views.delete_post, name="delete_post"),
    path("follow/<str:user>", views.follow, name="follow_user"),
    path("like_post/<int:id>", views.like_post, name="like_post"),
    path("profile/<str:user>", views.display_profile, name="display_profile"),
    path("register", views.following_posts, name="following_posts"),
    path("create_post", views.create_post, name="create_post"),
    path("all", views.all_posts, name="all_posts"),
    path("create_comment/<int:id>", views.create_comment, name="create_comment"),
    path("show_comments", views.show_comments, name="show_comments"),
    path("show_post/<str:id>", views.show_post, name="show_post"),
    path("edit_post/<int:id>", views.edit_post, name="edit_post"),
    path("following_posts/", views.following_posts, name="following_posts")

]
