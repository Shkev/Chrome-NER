# Chrome-NER

Web extension that identifies named entities in a webpage and labels them. Named entities are color coded on the webpage with different color highlights.

## Quick Start Guide

Clone the repository on a local machine. To get the extension working, you need an installation of Python 3.

### Starting API

In the root directory, install the required Python packages to run the API by running,

```bash
pip install -r ./api/requirements.txt
```

Note that the API runs on the Django web framework. Once all dependencies are installed, the API server can be started with,

```bash
python ./api/manage.py runserver
```

### Adding to Chrome

The extension has to be added to chrome before it can be used on any websites. To do this, go to the extensions page in a *chrome-based browser* (this is a strict requirement) and turn on developer mode. The `./extension` directory can then be loaded into chrome as an extesion which will show up in your toolbar.

The extension can be activated by opening the popup page and clicking the big button in the center. Ensure the API server is running before activating the extension.
