```javascript
(function() {
    const KEY_TRIGGER = {
        key: 'F',
        ctrlKey: true,
        shiftKey: true
    };
    const URL_PARAM_TRIGGER = '_feedback';
    const WIDGET_BASE_PATH = '/assets/feedback/'; // Adjust this path if your files are elsewhere

    let widgetContainer = null;
    let widgetLoaded = false;

    //