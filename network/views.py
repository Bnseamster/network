from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
import json

from .models import User, Comments, Post, UserFollowing


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
@login_required
def create_post(request):
    

    # makes sure request is Post
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # gets posts data
    data = json.loads(request.body)

    if data['text'] == "":
        return JsonResponse({
            "error": "Post cannot be blank."
        }, status=400)

    # Get contents of post
    text = data.get("text")

    # Add post data to db  
    newPost = Post(text= text, user= request.user) 
    newPost.save()
    
    return JsonResponse({"message": "New post created successfully."}, status=201)


def all_posts(request):
    # Gets all posts
    try:
        posts = Post.objects.all()
        
        
    except:
        return JsonResponse({"error": "Something went wrong."}, status=400)

    # Returns posts in reverse chronologial order
    posts = posts.order_by("-time").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)

@csrf_exempt
def show_post(request, id):
    # Gets selected posts
    id = int(id)
    
    try:
        post = Post.objects.get(id=id)

    except:
        return JsonResponse({"error": "Something went wrong."}, status=400)
    
    response= [post.serialize()]
    response[0]['currentUser']= str(request.user)
    
    
    return JsonResponse(response, safe=False)

@csrf_exempt
@login_required
def delete_post(request):
    

    # makes sure request is Post
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # gets posts data
    data = json.loads(request.body)

    if data['postID'] == "":
        return JsonResponse({
            "error": "There was a problem deleting your post"
        }, status=400)

    # Get contents of post
    postID = data.get("postID")
    post = Post.objects.get(id=postID)
    postsUser = str(post.user)
    CurrentUser = str(request.user)

    if postsUser == CurrentUser:
        post.delete()
    
    else:
        
        return JsonResponse({
            "error": "You cant delete someone elses post!"
        }, status=400)
    
    return JsonResponse({"message": "Post deleted successfully."}, status=201)

@csrf_exempt
@login_required
def create_comment(request,id):
    

    # makes sure request is POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # gets comment data
    
    data = json.loads(request.body)
    

    if data['text'] == "":
        
        return JsonResponse({
            "error": "Comment cannot be blank."
        }, status=400)

    # Get contents of comment
    text = data.get("text")

    # Add comment data to db  
    newComment = Comments(text= text, user= request.user) 
    newComment.save()

    posts = Post.objects.get(id=id)
    posts.comments.add(newComment)
    posts.save()

    
    return JsonResponse({
        "message": "New comment created successfully.",
        "text": text,
        "user": str(request.user)
        }, status=201)

@csrf_exempt
@login_required
def edit_post(request,id):

    # makes sure request is POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # gets comment data
    
    data = json.loads(request.body)
    

    if data['text'] == "":
        
        return JsonResponse({
            "error": "Edit cannot be blank."
        }, status=400)

    # Get contents of comment
    text = data.get("text")

    # Add comment data to db 

    posts = Post.objects.get(id=id)
    posts.text = text
    posts.save()
    
    
    return JsonResponse({"message": "Edit saved successfully."}, status=201)


def show_comments(request, id):
    # Gets selected post's comments
    id = int(id)
    try:
        posts = Post.objects.get(id=id)
        
    except:
        return JsonResponse({"error": "Something went wrong."}, status=400)

    return JsonResponse([posts.serialize()], safe=False)


@login_required
def follow(request,user):
    
    currentUser = str(request.user)
    followUser = str(user)
    



    currentUser = User.objects.get(username=currentUser)
    followUser = User.objects.get(username=followUser)




    if currentUser.following.filter(following_user_id=followUser).exists():
        UserFollowing.objects.filter(user_id=currentUser, following_user_id=followUser).delete()
        
    else:
        UserFollowing.objects.create(user_id=currentUser, following_user_id=followUser)       

    return JsonResponse({
        "message": "Followed succesfully.",
        "followers":followUser.followers.all().count(),
        "following":followUser.following.all().count()
        }, status=201)

@login_required
def like_post(request,id):
    id = int(id)
    
    post = Post.objects.filter(id=id).first()
    
    username = request.user
    user = User.objects.get(username=request.user)

    q= str(user.likes.filter(id=id).first())

    try:
        
        if q == 'None':
            post.whoLiked.add(user)            
            post.likes = post.likes + 1
            post.save()
            
            
        else:
            post.whoLiked.remove(user)            
            post.likes = post.likes - 1
            post.save()
            
           
        
    except:
        
        return JsonResponse({"error": "Something went wrong."}, status=400)

    return JsonResponse([post.serialize()], safe=False)
    


def display_profile(request,user):
    # Gets users posts
  
    try:
        
        user = str(user)

        u = User.objects.filter(username= user).first()

        posts = Post.objects.filter(user= u)
        
        followingCount = int(u.following.all().count())
        followerCount = int(u.followers.all().count())

        #checks if current user is following this profile

        currentUser = User.objects.get(username=request.user)

        currentUser = currentUser.following.filter(following_user_id=u).exists()
        

        if currentUser == False:
            followUnfollow = 'Follow'
        else:
            followUnfollow = 'Unfollow'


        
    except:
        
        return JsonResponse({"error": "Something went wrong."}, status=400)

    # Returns posts in reverse chronologial order
    posts = posts.order_by("-time").all()

    # makes a list for json info
    data = [post.serialize() for post in posts]
    

    return JsonResponse({
        "posts":data,
        "followers":followerCount,
        "following":followingCount,
        "followUnfollow": followUnfollow,
        "currentUser": str(request.user)    
    }, safe=False)

@login_required
def following_posts(request):
    # Gets all posts from users that the current user is following
    try:
        user = request.user
        u = User.objects.filter(username= user).first()
        following = u.following.all()
    


        posts = [user.following_user_id.posts.all() for user in following]
    
        
    except:
        return JsonResponse({"error": "Something went wrong."}, status=400)

    # Returns posts in reverse chronologial order
    posts = posts[0].order_by("-time").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)