from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse

from .models import Post
from account.models import User

# Create your tests here.

class PostModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()

        # Create a user
        cls.user = User.objects.create_user(
          name='melao', email='melao@gmail.com', password='abc123')

        # Create a post
        Post.objects.create(body='Post content...', created_by=cls.user)


    def test_post_content(self):
        post = Post.objects.get(created_by=self.user)
        expected_body = f'{post.body}'
        self.assertEqual(expected_body, 'Post content...')


    def test_post_get_status(self):
        # Create an instance of a GET request.
        request = self.client.get(reverse('post_list'))
        self.assertEqual(request.status_code, 401)


