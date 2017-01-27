# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2017-01-25 00:51
from __future__ import unicode_literals

import core.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('moniker', models.CharField(blank=True, max_length=64, null=True)),
                ('kind', models.CharField(blank=True, max_length=32, null=True)),
                ('label', models.CharField(blank=True, max_length=64, null=True)),
                ('type', models.CharField(blank=True, max_length=32, null=True)),
                ('subtype', models.CharField(blank=True, max_length=32, null=True)),
                ('primary', models.BooleanField(default=False)),
                ('data1', models.CharField(blank=True, max_length=64, null=True)),
                ('data2', models.CharField(blank=True, max_length=64, null=True)),
                ('data3', models.CharField(blank=True, max_length=64, null=True)),
                ('data4', models.CharField(blank=True, max_length=64, null=True)),
                ('data5', models.CharField(blank=True, max_length=64, null=True)),
                ('data6', models.CharField(blank=True, max_length=64, null=True)),
                ('data7', models.CharField(blank=True, max_length=64, null=True)),
                ('data8', models.CharField(blank=True, max_length=64, null=True)),
                ('data9', models.CharField(blank=True, max_length=64, null=True)),
                ('data10', models.TextField(blank=True, null=True)),
            ],
            bases=(models.Model, core.models.CreatedModifiedMixin),
        ),
    ]
