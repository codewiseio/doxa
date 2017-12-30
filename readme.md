# Doxa

Social CRM/Common Belief Platform 


## About

Doxa is a web application for powering a hub of private social networking pages and administration dashboards for religous and charitable organizations.

## Contributing



## Prerequisites

Python >=3.4.x

Node JS/NPM

	sudo apt-get install nodejs npm
    http://blog.teamtreehouse.com/install-node-js-npm-windows

Webpack

    npm  install webpack --global

## Project Setup

Clone the project from gitlab.com

    git clone git@gitlab.com:codewiseio/doxa.git doxa

Create Python Virtualenv

	virtualenv -p python3 venv

Install Python Modules

	pip install -r requirements.txt

Install node_modules

    cd angular/app
    npm install

Run development server for testing

    python manage.py runserver

Run testing suite

	python manage.py test

### Local Settings

You can over-ride the Django settings py creating a `settings_local.py` file the "app" subfolder. This is a good place to store machine specific settings, such as a local devleopment database. This file is ignored by git.


## Deployment

sudo -u postgres psql




https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-16-04


