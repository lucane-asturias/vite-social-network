from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import render

from rest_framework.decorators import api_view

from account.models import User, FriendshipRequest
from account.serializers import UserSerializer
from notification.utils import create_notification

from .forms import PostForm, AttachmentForm
from .models import Post, Like, Comment, Trend
from .serializers import PostSerializer, PostDetailSerializer, CommentSerializer, TrendSerializer


@api_view(['GET'])
def post_list(request):
    user_ids = [request.user.id]

    for friendUser in request.user.friends.all():
        user_ids.append(friendUser.id)

    posts = Post.objects.filter(created_by_id__in=list(user_ids))

    trend = request.GET.get('trend', '')

    if trend:
        posts = Post.objects.filter(body__icontains=f"#{trend}").filter(is_private=False)

    serializer = PostSerializer(posts, many=True)

    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
def post_list_profile(request, id):
    user = User.objects.get(pk=id)
    
    if request.user == user or request.user in user.friends.all():
        posts = Post.objects.filter(created_by_id=id)
    else:
        posts = Post.objects.filter(created_by_id=id).filter(is_private=False)

    posts_serializer = PostSerializer(posts, many=True)
    user_serializer = UserSerializer(user)

    can_send_friendship_request = not (
        # If already friends
        user.friends.filter(id=request.user.id).exists() or
        # If there are any existing friendship requests between the two users
        FriendshipRequest.objects.filter(
            Q(created_for=user, created_by=request.user) | 
            Q(created_for=request.user, created_by=user)
        ).exists()
    )

    return JsonResponse({
        'posts': posts_serializer.data,
        'user': user_serializer.data,
        'can_send_friendship_request': can_send_friendship_request
    }, safe=False)


@api_view(['POST'])
def post_create(request):
    attachment = None
    attachment_form = AttachmentForm(request.POST, request.FILES)
    post_form = PostForm(request.POST)

    if attachment_form.is_valid():
        attachment = attachment_form.save(commit=False)
        attachment.created_by = request.user
        attachment.save()

    if post_form.is_valid():
        post = post_form.save(commit=False)
        post.created_by = request.user
        post.save()

        if attachment:
            post.attachments.add(attachment)

        user = request.user
        user.posts_count = user.posts_count + 1
        user.save()

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
        
        # Check if request.user is not the creator of the post
        if request.user.id != post.created_by.id:
            notification = create_notification(request, 'post_like', post_id=post.id)

        return JsonResponse({'message': 'like incremented'})
    else:
        post.likes_count = post.likes_count - 1
        post.likes.filter(created_by=request.user).delete()
        post.save()

        return JsonResponse({'message': 'like decremented'})


@api_view(['GET'])
def post_detail(request, pk):
    user_ids = [request.user.id]

    for user in request.user.friends.all():
        user_ids.append(user.id)

    post = Post.objects.filter(
        Q(created_by_id__in=list(user_ids)) | 
        Q(is_private=False)
    ).get(pk=pk)

    return JsonResponse({
        'post': PostDetailSerializer(post).data
    })


@api_view(['POST'])
def post_create_comment(request, pk):
    comment = Comment.objects.create(body=request.data.get('body'), created_by=request.user)

    post = Post.objects.get(pk=pk)
    post.comments.add(comment)
    post.comments_count = post.comments_count + 1
    post.save()

    notification = create_notification(request, 'post_comment', post_id=post.id)

    serializer = CommentSerializer(comment)

    return JsonResponse(serializer.data, safe=False)


@api_view(['DELETE'])
def post_delete(request, pk):
    post = Post.objects.filter(created_by=request.user).get(pk=pk)
    post.delete()

    return JsonResponse({ 'message': 'post_deleted' })


@api_view(['POST'])
def post_report(request, pk):
    post = Post.objects.get(pk=pk)

    if not post.reported_by_users.filter(pk=request.user.pk).exists():
        post.reported_by_users.add(request.user)
        post.save()

        return JsonResponse({'message': 'post reported'})

    return JsonResponse({'message': 'post already reported'})


@api_view(['GET'])
def get_trends(request):
    trends = Trend.objects.all()
    serializer = TrendSerializer(trends, many=True)

    return JsonResponse(serializer.data, safe=False)