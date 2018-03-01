// Grade details test
var PARAMS = getParams();

let siteDetails = [ ];

$(document).ready(function() {

    /*
     * Get test params from the url and set any defaults
     */
    if (PARAMS.url) {
        clearCache().then(runTest(PARAMS.url).then(() => {

            if (PARAMS.json) {
                $('#gradedetails').append(`<div id="json-data">${JSON.stringify(siteDetails, null, 4)}</div>`);
                // $('#json-data').append(`${JSON.stringify(siteDetails, null, 4)}`)
            }
        }))
        return;
    }
});


/*
 * Navigate to a url
 */
function runTest(url) {
    return new Promise((resolve) => {

        let blockingOnStartTime = Date.now();

        chrome.tabs.create({url}, (t) => {

            getLoadedTabById(t.id, blockingOnStartTime, 9000, 3000).then((tab) => {
                let blocking = bkg.settings.getSetting('trackerBlockingEnabled')
                let tabObj = bkg.tabManager.get({'tabId': tab.id});

                if (blocking) {
                    siteDetails.push({
                        url: url,
                        scoreObj: tabObj.site.score,
                        score: tabObj.site.score.get()
                    })
                }

                chrome.tabs.remove(tab.id);
                resolve()
            })
        });
    });
}
