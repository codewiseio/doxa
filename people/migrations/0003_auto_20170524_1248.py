# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2017-05-24 16:48
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('people', '0002_person_account'),
    ]

    operations = [
        migrations.RenameField(
            model_name='person',
            old_name='account',
            new_name='user',
        ),
    ]
