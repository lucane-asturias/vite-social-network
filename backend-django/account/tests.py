from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse

from .models import User, FriendshipRequest

# Create your tests here.

class AccountApiTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        # Setup users and login
        cls.user1 = User.objects.create_user(
          name='beterraba', email='beterraba@gmail.com', password='titanic12345')
        cls.user2 = User.objects.create_user(
          name='melao', email='melao@gmail.com', password='shark12345')

        beterraba_token_response = cls.client.post(reverse('token_obtain'), {
          'email': 'beterraba@gmail.com', 
          'password': 'titanic12345'
        })

        cls.access = beterraba_token_response.json()['access']


    def test_signup_and_login_response(self):
        response = self.client.post(reverse('signup'), { 'key': 'value' })
        self.assertEqual(response.json()['message'], 'error')
        self.assertEqual(response.status_code, 200)

        payload = { 
          'name': 'morango', 
          'email': 'morango@gmail.com', 
          'password1': 'qualia12345', 
          'password2': 'qualia12345' 
        }
        response = self.client.post(reverse('signup'), payload)
        self.assertEqual(response.json()['message'], 'success')
        self.assertEqual(response.status_code, 200)

        response = self.client.get(reverse('me'))
        self.assertEqual(
          response.json()['detail'], 
          'Authentication credentials were not provided.'
        )
        self.assertEqual(response.status_code, 401)

        response = self.client.post(reverse('token_obtain'), {
          'email': 'morango@gmail.com', 
          'password': 'qualia12345'
        })

        response = self.client.get(
          reverse('me'), 
          headers={'Authorization': f"Bearer {response.json()['access']}"}
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['name'], 'morango')
        self.assertEqual(response.json()['email'], 'morango@gmail.com')


    def test_send_friendship_request(self):
        user = User.objects.create_user(
          name='morango', email='morango@gmail.com', password='qualia12345')

        token_response = self.client.post(reverse('token_obtain'), {
          'email': 'morango@gmail.com', 
          'password': 'qualia12345'
        })

        response = self.client.post(reverse('send_friendship_request', args=[user.id]))
        self.assertEqual(response.status_code, 401)

        self.client.defaults['HTTP_AUTHORIZATION'] = f"Bearer {token_response.json()['access']}"

        response = self.client.post(reverse('send_friendship_request', args=[user.id]))
        self.assertEqual(response.status_code, 200)

        # 1 Condition
        self.assertEqual(response.json()['message'], 'friendship request created')
        post = FriendshipRequest.objects.get(created_by=user.id)
        self.assertEqual(post.status, 'sent')
        self.assertEqual(post.created_by, user)
        # 2 Condition
        response = self.client.post(reverse('send_friendship_request', args=[user.id]))
        self.assertEqual(response.json()['message'], 'request already sent')


    def test_handle_friendship_request(self):
        self.client.defaults['HTTP_AUTHORIZATION'] = f"Bearer {self.access}"

        response = self.client.post(reverse('send_friendship_request', args=[self.user2.id]))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'friendship request created')

        token_response = self.client.post(reverse('token_obtain'), {
          'email': 'melao@gmail.com', 
          'password': 'shark12345'
        })

        self.client.defaults['HTTP_AUTHORIZATION'] = f"Bearer {token_response.json()['access']}"

        response = self.client.post(reverse('handle_friendship_request', args=[self.user1.id, 'accepted']))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'friendship request updated')

        user1_request_status = FriendshipRequest.objects.filter(created_by=self.user1.id).values()[0]['status']
        self.assertEqual(user1_request_status, 'accepted')

        user1_friends_count = User.objects.filter(id=self.user1.id).values()[0]['friends_count']
        self.assertEqual(user1_friends_count, 1)

        user2_friends_count = User.objects.filter(friends=self.user2).values()[0]['friends_count']
        self.assertEqual(user2_friends_count, 1)


    def test_friends(self):
        self.client.defaults['HTTP_AUTHORIZATION'] = f"Bearer {self.access}"
        response = self.client.get(reverse('friends', args=[self.user1.id]))
        print(len(response.json()['user']), 1)
        self.assertEqual(len(response.json()['requests']), 0)
        self.assertEqual(len(response.json()['friends']), 0)

        self.client.post(reverse('send_friendship_request', args=[self.user2.id]))
        token_response = self.client.post(reverse('token_obtain'), {
          'email': 'melao@gmail.com', 
          'password': 'shark12345'
        })

        self.client.defaults['HTTP_AUTHORIZATION'] = f"Bearer {token_response.json()['access']}"

        response = self.client.get(reverse('friends', args=[self.user2.id]))
        self.assertEqual(len(response.json()['requests']), 1)

        response = self.client.post(reverse('handle_friendship_request', args=[self.user1.id, 'accepted']))

        response = self.client.get(reverse('friends', args=[self.user2.id]))
        self.assertEqual(len(response.json()['requests']), 0)

        self.client.defaults['HTTP_AUTHORIZATION'] = f"Bearer {self.access}"

        response = self.client.get(reverse('friends', args=[self.user1.id]))
        self.assertEqual(len(response.json()['friends']), 1)