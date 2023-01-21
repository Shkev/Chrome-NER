/**
 * Get all tags that contains displayed text from the current page
 * (i.e., <h>, <p>, etc.)
 * @return {Array} Array of text tags
 */
function GetTextTagsFromSite() {
    const text_tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'a', 'span'];
    var text_containers = [];
    text_tags.forEach(function(tag_label) {
        const tags = document.getElementsByTagName(tag_label);
        for (var j = 0; j < tags.length; j++) {
            if (tags[j].innerText.length > 0) {
                text_containers.push(tags[j]);
            }
        }
    });
    return text_containers;
}

/**
 * Get the color to highlight a named entity of a given type.
 * Each named entity type is assigned a color to highlight it once it is identified.
 * @param {String} ne_type - Named entity type
 * @return {String} Color to highlight named entity of given type
*/
function GetNEColor(ne_type) {
    const ne_categories = ['CARDINAL', 'DATE', 'EVENT', 'FAC', 'GPE', 'LANGUAGE', 'LAW', 'LOC', 'MONEY', 'NORP', 'ORDINAL', 'ORG',
                            'PERCENT', 'PERSON', 'PRODUCT', 'QUANTITY', 'TIME', 'WORK_OF_ART'];
    const ne_colors = ['#ff7f0e', '#1f77b4', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
                        '#aec7e8', '#98df8a', '#ff9896', '#c5b0d5', '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5'];
    const ne_color_map = new Map();
    ne_categories.forEach(function(ne_category, i) {
        ne_color_map.set(ne_category, ne_colors[i]);
    });
    return ne_color_map.get(ne_type);
}

/**
 * Tag named entities in the text contained in a text container.
 * Modifies the DOM by adding <mark> tags around named entities and highlighting them.
 * @param {HTMLElement} text_container - HTML element containing text to be tagged
 * @return {void}
*/
function TagEntitiesWithAPI(text_container) {
    const text = text_container.innerText;
    // send text to background.js script and get tagged NEs as response
    chrome.runtime.sendMessage({status: "ping-api", text: text}, function(response) {
        // response contains a list of NEs
        // replace text with tagged NEs
        const named_entities = response['ne'];
        let new_text = text;
        named_entities.forEach(function(ne) {
            const ne_text = ne['text'];
            const ne_type = ne['label'];
            const ne_color = GetNEColor(ne_type);
            const ne_tag = `<mark style="background-color: ${ne_color};">${ne_text} (${ne_type})</mark>`;
            new_text = new_text.replace(ne_text, ne_tag);
        });
        text_container.innerHTML = new_text;
    });
}

/**
 * Tag named entities on the current page.
 * Modifies the DOM by adding <mark> tags around named entities and highlighting them.
 * @return {void}
 */
function TagNamedEntitiesOnPage() {
    console.log('Extracting text from page...');
    text_containers = GetTextTagsFromSite();
    console.log('Tagging text on page...');
    text_containers.forEach(TagEntitiesWithAPI);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'init' && request.status === 'tag') { // received message from popup to tag entities on page
        sendResponse('Tagging Entities...');
        TagNamedEntitiesOnPage();
    }
    return true; // required to keep message port open in popup.js (awaiting response)
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.set({'click-count': 0});
});