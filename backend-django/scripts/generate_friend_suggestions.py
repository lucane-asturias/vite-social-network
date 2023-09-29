# -*- coding: utf-8 -*-

import django
import os
import sys

from datetime import timedelta
from collections import Counter
from django.utils import timezone


sys.path.append(os.path.join(os.path.abspath(os.path.dirname(__file__)), '..'))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wey_backend.settings")
django.setup()


from account.models import User


def find_potential_friends(user):
    # Store potential friends
    potential_friends = set()

    # Loop through each friend of the user
    for friend in user.friends.all():
        # Loop through each friend of the current friend (friend's friend)
        for friendsfriend in friend.friends.all():
            # Check if friendsfriend is not already a friend of the user and is not the user itself
            if friendsfriend != user and friendsfriend not in user.friends.all():
                potential_friends.add(friendsfriend)

    return potential_friends


# Retrieve all users from the database
users = User.objects.all()


for user in users:
    # Clear the suggestion list
    user.people_you_may_know.clear()

    print('Find friends for:', user)

    # Find potential friends for the current user
    potential_friends = find_potential_friends(user)

    # Add potential friends to the "people you may know" list
    user.people_you_may_know.add(*potential_friends