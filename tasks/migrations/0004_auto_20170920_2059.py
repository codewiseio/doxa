# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-09-20 20:59
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0003_auto_20170919_1229'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assignee',
            name='task',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assignees', to='tasks.Task'),
        ),
    ]
