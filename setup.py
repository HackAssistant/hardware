import os
from setuptools import find_packages, setup
with open(os.path.join(os.path.dirname(__file__), 'README.rst')) as readme:
	README = readme.read()

# allow setup.py to be run from any path
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

setup(
	name='django-ha-hardware',
	version='0.1',
	packages=find_packages(),
	include_package_data=True,
	license='MIT License',
	decsription='A Django app extension for HackAssistant to handle hardware lendings to hackers.',
	long_description=README,
	url='https://github.com/HackAssistant/hardware',
	author='Gerard del Castillo (@aslogd)',
	author_email='gerarddelcastillo@gmail.com',
	classifiers=[
		'Environment :: Web Environment',
		'Framework :: Django',
		'Framework :: Django :: HackAssistant',
		'Intended Audience :: Developers',
		'License :: OSI Approved :: MIT License',
		'Operating System :: OS Independent',
		'Programming Language :: Python',
		'Topic :: Internet :: WWW/HTTP',
		'Topic :: Internet :: WWW/HTTP :: Dynamic Content'
	]
)