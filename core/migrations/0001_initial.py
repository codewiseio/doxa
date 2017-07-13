# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-11-24 20:46
from __future__ import unicode_literals

import core.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, max_length=255)),
                ('first_name', models.CharField(max_length=32)),
                ('middle_name', models.CharField(max_length=32)),
                ('last_name', models.CharField(max_length=32)),
                ('gender', models.CharField(blank=True, max_length=1)),
                ('date_of_birth', models.DateField(blank=True)),
                ('marital_status', models.PositiveSmallIntegerField(blank=True, choices=[('', '-- select --'), (1, 'Single'), (2, 'Married'), (3, 'Divorces/Deparated'), (4, 'Widowed')])),
                ('number_of_children', models.PositiveSmallIntegerField(blank=True, choices=[('', '-- select --'), (1, '1 child'), (2, '2 children'), (3, '3 children'), (4, '4 children'), (5, '5 children'), (6, '6 children'), (7, '7 children or more')])),
                ('telephone', models.CharField(blank=True, max_length=24)),
                ('email', models.EmailField(blank=True, max_length=64)),
                ('address1', models.CharField(blank=True, max_length=128, verbose_name='Street Address')),
                ('line2', models.CharField(blank=True, max_length=128, verbose_name='Street Address 2')),
                ('municipality', models.CharField(blank=True, max_length=128, verbose_name='Municipality')),
                ('region', models.CharField(blank=True, max_length=128, verbose_name='Region')),
                ('postal_code', models.CharField(blank=True, max_length=16, verbose_name='Postal Code')),
                ('country', models.CharField(blank=True, max_length=32, verbose_name='Country')),
                ('banner_photo', models.ImageField(blank=True, upload_to='')),
                ('profile_photo', models.ImageField(blank=True, upload_to='')),
            ],
            bases=(models.Model, core.models.CreatedModifiedMixin),
        ),
        migrations.CreateModel(
            name='Organization',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('slug', models.SlugField(allow_unicode=True, blank=True, max_length=255)),
                ('description', models.TextField(blank=True)),
                ('size', models.PositiveSmallIntegerField(blank=True, choices=[('', '-- select --'), (1, '2-10 people'), (2, '11-50 people'), (3, '51-100 people'), (4, '101-250 people'), (5, '251 people or more')])),
                ('telephone', models.CharField(blank=True, max_length=24)),
                ('email', models.EmailField(blank=True, max_length=64)),
                ('address', models.CharField(blank=True, max_length=128, verbose_name='Street Address')),
                ('address2', models.CharField(blank=True, max_length=128, verbose_name='Street Address 2')),
                ('municipality', models.CharField(blank=True, max_length=128, verbose_name='Municipality')),
                ('region', models.CharField(blank=True, max_length=128, verbose_name='Region')),
                ('postal_code', models.CharField(blank=True, max_length=16, verbose_name='Postal Code')),
                ('country', models.CharField(blank=True, max_length=64, null=True, verbose_name='Country')),
                ('banner_photo', models.ImageField(blank=True, upload_to='')),
                ('profile_photo', models.ImageField(blank=True, upload_to='')),
            ],
            bases=(models.Model, core.models.CreatedModifiedMixin),
        ),
        migrations.AddField(
            model_name='contact',
            name='organization',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Organization'),
        ),
        migrations.AddField(
            model_name='contact',
            name='spouse',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.Contact'),
        ),
    ]
