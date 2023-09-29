from django.test import TestCase

from rest_framework.test import APIClient
from rest_framework import status

from django.urls import reverse

from .models import Notification
from account.models import User, FriendshipRequest

# Create your tests here.


class NotificationTestCase(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()

        # Create users to test
        cls.user1 = User.objects.create_user(
          name='melao', email='melao@gmail.com', password='shark12345')
        cls.user2 = User.objects.create_user(
          name='beterraba', email='beterraba@gmail.com', password='titanic12345')

        # Login
        response = cls.client.post(reverse('token_obtain'), {
          'email': 'melao@gmail.com', 
          'password': 'shark12345'
        })
                
        # Create notifications
        cls.notification1 = Notification.objects.create(
            body="Notification 1",
            created_for=cls.user1,
            created_by=cls.user2,
            is_read=False
        )
        cls.notification2 = Notification.objects.create(
            body="Notification 2",
            created_for=cls.user1,
            created_by=cls.user2,
            is_read=False
        )

        cls.access = response.json()['access']


    def test_get_notifications(self):
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.access}'

        # Send a GET request to the notifications endpoint
        response = self.client.get(reverse('notifications'))

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Parse the JSON response
        data = response.json()

        # Ensure that the response is a list of dictionaries
        self.assertIsInstance(data, list)

        for notification in data:
            self.assertIn('id', notification)
            self.assertIn('body', notification)
            self.assertIn('type_of_notification', notification)
            self.assertIn('post_id', notification)
            self.assertIn('created_for_id', notification)

            self.assertIsInstance(notification['id'], str)
            self.assertIsInstance(notification['body'], str)
            self.assertIsInstance(notification['type_of_notification'], str)
            self.assertIsInstance(notification['post_id'], (str, type(None)))
            self.assertIsInstance(notification['created_for_id'], str)
            
            self.assertEqual(str(notification['created_for_id']), str(self.user1.id))


    def test_read_notification(self):
        # Authenticate the client as the test user
        self.client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {self.access}'

        # Send a POST request to mark a notification as read
        response = self.client.post(reverse('read_notification', args=[self.notification1.id]))

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the notification is marked as read
        self.notification1.refresh_from_db()
        self.assertTrue(self.notification1.is_read)

        # Check that a message is returned in the response
        self.assertEqual(response.json(), {'message': 'notification read'})