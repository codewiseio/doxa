
PROJECT SETUP

Clone the project from gitlab.com

    git clone git@gitlab.com:codewiseio/doxa.git doxa

Create a settings_local.py file in the "doxa" subfolder. Modify any necessary settings here.

Create Virtualenv

virtualenv -p python3 venv

Install Modules

pip install -r requirements.txt


Install Node JS/NPM

    http://blog.teamtreehouse.com/install-node-js-npm-windows

Install webpack

    npm  install webpack --global

Install node_modules

    cd static
    npm install



Run development server for testing

    python manage.py runserver




Requirements PYTHON ^3.5.2
Django 
, NPM, Webpack



DEVELOPMENT

Webpack must be run for any changes to "static" files to be reflected

    cd static
    webpack

Point your web browser to http://localhost:8000/



