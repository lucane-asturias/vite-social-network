from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse

from .models import Conversation
from account.models import User

# Create your tests here.

class ConversationModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()

        cls.user1 = User.objects.create_user(
          name='beterraba', email='beterraba@gmail.com', password='titanic12345')
        cls.user2 = User.objects.create_user(
          name='melao', email='melao@gmail.com', password='shark12345')

        beterraba_token_response = cls.client.post(reverse('token_obtain'), {
          'email': 'beterraba@gmail.com', 
          'password': 'titanic12345'
        })

        cls.access = beterraba_token_response.json()['access']


    def test_conversation_get_or_create(self):
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.access}'

        response = self.client.get(reverse('conversation_get_or_create', args=[self.user2.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len((response.json()['users'])), 2)


    def test_conversation_list(self):
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.access}'
        response = self.client.get(reverse('conversation_list'))
        self.assertEqual(len(response.json()), 0)
        self.client.get(reverse('conversation_get_or_create', args=[self.user2.id]))
        response = self.client.get(reverse('conversation_list'))
        self.assertEqual(len((response.json()[0]['users'])), 2)


    def test_conversation_detail(self):
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.access}'
        response = self.client.get(reverse('conversation_get_or_create', args=[self.user2.id]))

        conversation_pk = response.json()['id']
        response = self.client.get(reverse('conversation_detail', args=[conversation_pk]))
        self.assertEqual(len(response.json()['users']), 2)
        self.assertEqual(len(response.json()['messages']), 0)
        self.assertEqual(response.json()['id'], conversation_pk)


    def test_conversation_send_message(self):
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.access}'
        response = self.client.get(reverse('conversation_get_or_create', args=[self.user2.id]))
        conversation_pk = response.json()['id']
        response = self.client.post(reverse('conversation_send_message', args=[conversation_pk]), {
          'body': 'First message from [user2]'
        })
        self.assertEqual(response.json()['body'], 'First message from [user2]')
        self.assertEqual(response.json()['sent_to']['email'], 'melao@gmail.com')
        self.assertEqual(response.json()['created_by']['email'], 'beterraba@gmail.com')
        
        token_response = self.client.post(reverse('token_obtain'), {
          'email': 'melao@gmail.com', 
          'password': 'shark12345'
        })

        self.client.defaults['HTTP_AUTHORIZATION'] = f"Bearer {token_response.json()['access']}"

        response = self.client.post(reverse('conversation_send_message', args=[conversation_pk]), {
          'body': 'First message from [user1]'
        })
        self.assertEqual(response.json()['body'], 'First message from [user1]')
        self.assertEqual(response.json()['sent_to']['email'], 'beterraba@gmail.com')
        self.assertEqual(response.json()['created_by']['email'], 'melao@gmail.com')
