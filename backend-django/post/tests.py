from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse

from collections import Counter

from .models import Post, Trend
from account.models import User, FriendshipRequest


# Create your tests here.

class PostModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()

        # Create a user
        cls.user = User.objects.create_user(
          name='melao', email='melao@gmail.com', password='shark12345')

        # Login
        response = cls.client.post(reverse('token_obtain'), {
          'email': 'melao@gmail.com', 
          'password': 'shark12345'
        })

        cls.access = response.json()['access']

        # Create posts
        Post.objects.create(body='Melao Post content...', created_by=cls.user)
        Post.objects.create(body='Second Melao Post content...', created_by=cls.user)
        Post.objects.create(body='Test #django hashtag...', created_by=cls.user)
        Post.objects.create(body='Test #django ist wunderbar', created_by=cls.user)


    def test_post_list_with_friends(self):
        post = Post.objects.filter(body='Melao Post content...').values()
        response = self.client.get(reverse('post_list'))
        self.assertEqual(post[0]['body'], 'Melao Post content...')

        # Create user to be friends
        userB = User.objects.create_user(
          name='beterraba', email='beterraba@gmail.com', password='titanic12345')
        token_response = self.client.post(reverse('token_obtain'), {
          'email': 'beterraba@gmail.com', 
          'password': 'titanic12345'
        })
        self.client.defaults['HTTP_AUTHORIZATION'] = f"Bearer {token_response.json()['access']}"

        Post.objects.create(body='Beterraba Post content...', created_by=userB)
        Post.objects.create(body='Second Beterraba Post content...', created_by=userB)

        self.client.post(reverse('send_friendship_request', args=[self.user.id]))

        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.access}'
        self.client.post(reverse('handle_friendship_request', args=[userB.id, 'accepted']))

        response = self.client.get(reverse('post_list'))
        self.assertEqual(len(response.json()), 6)


    def test_post_list_with_trend_query(self):
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.access}'
        response = self.client.get(reverse('post_list'), { 'trend': 'django' })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)

        trends = []
        for post in response.json():
            for word in post['body'].split():
                if word[0] == '#':
                    trends.append(word[1:])

        for trend in trends:
            self.assertEqual(trend, 'django')

        self.assertEqual(len(trends), 2)


    def test_post_increment_like(self):
        post = Post.objects.get(body='Melao Post content...')
        response = self.client.post(reverse('post_increment_like', args=[post.id]))
        self.assertEqual(response.status_code, 401)

        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.access}'

        # 1 Condition
        response = self.client.post(reverse('post_increment_like', args=[post.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'like incremented')
        post = Post.objects.get(id=post.id) # new instance
        self.assertEqual(post.likes_count, 1)
        self.assertEqual(len(post.likes.filter(created_by=self.user)), 1)
        # 2 Condition
        response = self.client.post(reverse('post_increment_like', args=[post.id]))
        self.assertEqual(response.json()['message'], 'like decremented')
        post = Post.objects.get(id=post.id) # new instance
        self.assertEqual(post.likes_count, 0)
        self.assertEqual(post.likes.filter(created_by=self.user).exists(), False)


    def test_post_create_Comment(self):
        post = Post.objects.get(body='Melao Post content...')
        response = self.client.post(reverse('post_create_comment', args=[post.id]))
        self.assertEqual(response.status_code, 401)

        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.access}'

        response = self.client.post(reverse('post_create_comment', args=[post.id]), {
          'body': 'First comment...'
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(post.comments.all()), 1)

        comment = post.comments.filter(id=response.json()['id']).values()
        self.assertEqual(comment[0]['body'], 'First comment...')
        post = Post.objects.get(body='Melao Post content...') # new instance
        self.assertEqual(post.comments_count, 1)


    def test_get_trends(self):
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.access}'

        trends = []

        def extract_hashtags(text, trends):
            for word in text.split():
                if word[0] == '#':
                    trends.append(word[1:])
            
            return trends

        for post in Post.objects.all():
            extract_hashtags(post.body, trends)

        for trend in Counter(trends).most_common(10):
            Trend.objects.create(hashtag=trend[0], occurences=trend[1])


        response = self.client.get(reverse('get_trends'))
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]['occurences'], 2)
