from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse

from post.models import Post
from account.models import User

# Create your tests here.

class SearchApiTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()

        # Create user
        cls.user = User.objects.create_user(
          name='melao', email='melao@gmail.com', password='abc123'
        )

        # Create posts to search
        Post.objects.create(body='skeleton', created_by=cls.user)
        Post.objects.create(body='melao', created_by=cls.user)


    def test_search_api(self):
        post = Post.objects.filter(body='skeleton').values()
        skeleton = post[0]['body']
        self.assertEqual(skeleton, 'skeleton')

        response = self.client.post(reverse('search'), { 
          'query': skeleton 
        })

        self.assertEqual(response.status_code, 401)

        response = self.client.post(reverse('token_obtain'), {
          'email': 'melao@gmail.com', 
          'password': 'abc123'
        })
        access = response.json()['access']

        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {access}'

        response = self.client.post(reverse('search'), { 
          'query': skeleton 
        })

        self.assertEqual(len(response.json()['users']), 0)
        self.assertEqual(len(response.json()['posts']), 1)

        self.assertEqual(response.json()['posts'][0]['body'], skeleton)

        response = self.client.post(reverse('search'), { 
          'query': 'melao'
        })

        self.assertEqual(len(response.json()['users']), 1)
        self.assertEqual(len(response.json()['posts']), 1)

        self.assertEqual(response.json()['users'][0]['name'], 'melao')