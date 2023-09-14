from django.http import JsonResponse
from django.shortcuts import render

from rest_framework.decorators import api_view

from account.models import User
from account.serializers import UserSerializer

from .forms import PostForm
from .models import Post, Like
from .serializers import PostSerializer


@api_view(['GET'])
def post_list(request):
    user_ids = [request.user.id]

    for friendUser in request.user.friends.all():
        user_ids.append(friendUser.id)

    posts = Post.objects.filter(created_by_id__in=list(user_ids))

    serializer = PostSerializer(posts, many=True)

    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
def post_list_profile(request, id):
    user = User.objects.get(pk=id)
    posts = Post.objects.filter(created_by_id=id)

    posts_serializer = PostSerializer(posts, many=True)
    user_serializer = UserSerializer(user)

    return JsonResponse({
        'posts': posts_serializer.data,
        'user': user_serializer.data
    }, safe=False)


@api_view(['POST'])
def post_create(request):
    form = PostForm(request.data)

    if form.is_valid():
        post = form.save(commit=False)
        post.created_by = request.user
        post.save()

        serializer = PostSerializer(post)

        return JsonResponse(serializer.data, safe=False)

    else:
        return JsonResponse({'message': 'error'})


@api_view(['POST'])
def post_increment_like(request, pk):
    post = Post.objects.get(pk=pk)

    if not post.likes.filter(created_by=request.user):
        like = Like.objects.create(created_by=request.user)

        post.likes_count = post.likes_count + 1
        post.likes.add(like)
        post.save()

        return JsonResponse({'message': 'like incremented'})
    elif post.likes_count == 1:
        post.likes_count = 0
        post.likes.filter(created_by=request.user).delete()
        post.save()

        return JsonResponse({'message': 'like decremented'})