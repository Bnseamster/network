# Generated by Django 3.0.8 on 2020-08-01 22:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0010_auto_20200801_1529'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='comments',
            field=models.ManyToManyField(null=True, to='network.Comments'),
        ),
    ]
