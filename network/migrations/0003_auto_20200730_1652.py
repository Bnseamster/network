# Generated by Django 3.0.8 on 2020-07-30 23:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_comments_follower_following_post'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='comments',
            field=models.ManyToManyField(null=True, to='network.Comments'),
        ),
        migrations.AlterField(
            model_name='post',
            name='text',
            field=models.TextField(max_length=256, null=True),
        ),
    ]
