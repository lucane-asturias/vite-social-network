from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse

from .models import User

# Create your tests here.

class AccountApiTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()


    def test_signup_and_login_response(self):
        response = self.client.post(reverse('signup'), { 'key': 'value' })
        self.assertEqual(response.json()['message'], 'error')
        self.assertEqual(response.status_code, 200)

        payload = { 
          'name': 'melao', 
          'email': 'melao@gmail.com', 
          'password1': 'shark12345', 
          'password2': 'shark12345' 
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
          'email': 'melao@gmail.com', 
          'password': 'shark12345'
        })

        response = self.client.get(
          reverse('me'), 
          headers={'Authorization': f'Bearer {response.json()['access']}'}
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['name'], 'melao')
        self.assertEqual(response.json()['email'], 'melao@gmail.com')