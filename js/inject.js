console.log("ChuckChecker Succesfully Injected!\nChecking HTML tree shortly...")

var checkerInterval = setInterval(() => {

    if (document.URL.includes("mathxlforschool.com")) {
        console.log("[ChuckChecker] this is MathXL, finding iframe...")
        let iframes = $("iframe")
        iframes.toArray().forEach((frame) => {
            if (frame.id.includes("MasterContent")) {
                //MasterContent iframe is what the homework is actually done in.
                clearInterval(checkerInterval)
                let url = frame['src']
                setTimeout(() => {
                    bootbox.confirm({
                        title: "🧠👓 Use ChuckChecker?",
                        centerVertical: true,
                        message: "To initiate ChuckChecker the embedded iframe must be opened. All this will do is reload the page. Continue?",
                        className: 'cc-alert',
                        callback: (result) => {
                            if (result == true) {
                                window.open(url, '_self');
                            }
                        }
                    });
                }, 2500);

            }
        })

    } else if (document.URL.includes("pearsoncmg.com")) {
        console.log("[ChuckChecker] this is Pearson CMG, finding contentholders...")
        let iframes = $("iframe")
        iframes.toArray().forEach((frame) => {
            if (frame.id.includes("activityFrame")) {
                let content = $(frame.contentDocument)
                var contentHolders = content.find(".contentHolder")
                if (contentHolders.length > 0) {
                    //found the question box
                    clearInterval(checkerInterval)
                    console.log(contentHolders)
                    console.log(contentHolders[0]["innerText"])
                }
            }
        })
    }


    //
}, 7000)