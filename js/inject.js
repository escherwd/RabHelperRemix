console.log("ChuckChecker Succesfully Injected!\nChecking HTML tree shortly...")

/**
 * @param {JQuery<any>} ch - The content holder
*/
function cms_inject(ch) {
    
    //output
    let q = ch.text()


    set_status("Parsing Problem...")
    console.log("question before: ",q)
    let parsed = parseProblem(q)
    if (parsed != null) {
        console.log("parsed: ",parsed["parsed"])
        set_status("Solving via Wolfram Alpha...")
        wolframAPIRequest(api_input_url+encodeURIComponent(parsed["parsed"]),(data) => {
            let xml = $(data)
            if (xml.find("queryresult").attr("success") == "true") {
                set_status("Parsing Results...")
                let answer = parsed["handle"](data)
                if (answer != null) {
                    console.log(answer)
                    set_status(answer)
                } else {
                    set_status("Could not parse the response. Problem could not be solved.")
                }
                
            } else {
                console.log(xml)
                set_status("Failed to solve problem.")
            }
        },(error) => {
            set_status("The request to Wolfram Alpha failed. Problem could not be solved.")
        })
    } else {
        set_status("Problem not supported.")
    }
}

/**
 * @param {JQuery<any>} container - The container to append the status to. Will remove the pre-existing one.
 * @param {string} message - The HTML message.
*/
function set_status(message) {
    $("body .cc-status").remove()
    $("body").prepend(`<div class='cc-status'><img src="${rabchuk_icon}">&nbsp;&nbsp;<span>${message}</span></div>`)
}

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
                    /*bootbox.confirm({
                        title: "🧠👓 Use ChuckChecker?",
                        centerVertical: true,
                        message: "To initiate ChuckChecker the embedded iframe must be opened. All this will do is reload the page. Continue?",
                        className: 'cc-alert',
                        callback: (result) => {
                            if (result == true) {
                                window.open(url, '_self');
                            }
                        }
                    });*/
                    alerty.confirm("Initiate ChuckChecker? This will reload the page.",{
                        title: "ChuckChecker 👨🏻",
                        okLabel: "🚀 Go!",
                        cancelLabel: "Cancel"
                    },() => {
                        window.open(url, '_self');
                    },() => {
                        console.log("[ChuckChecker] user chose not to initiate.")
                    })
                }, 2500);

            }
        })

    } else if (document.URL.includes("pearsoncmg.com")) {
        console.log("[ChuckChecker] this is Pearson CMG, finding contentholders...")
        check_iframes()
    }


    //
}, 1000)

var prev_assignment_text = ""

setInterval(() => {
    let new_assignment_text = $("#xl_assignment_OverviewButton_0").text()
    if (prev_assignment_text != new_assignment_text) {
        prev_assignment_text = new_assignment_text
        console.log("[ChuckChecker] assignment mismatch... re-checking iframes. (probably changed problem)")
        setTimeout(() => {
            check_iframes()
        }, 1000);
    }
}, 500);

function check_iframes() {
    console.log("[ChuckChecker] checking iframes...")
    let iframes = $("iframe")
    iframes.toArray().forEach((frame) => {
        if (frame.id.includes("activityFrame")) {
            let content = $(frame.contentDocument)
            var contentHolders = content.find(".contentHolder")
            if (contentHolders.length > 0) {
                clearInterval(checkerInterval)
                let ch = contentHolders.first()
                cms_inject(ch)
            }
        }
    })
}