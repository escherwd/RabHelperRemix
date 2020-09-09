const client_input_url = "https://www.wolframalpha.com/input/"
const api_key = "RK4LXH-GH36Q6PVVQ"
const api_input_url = `http://api.wolframalpha.com/v2/query?appid=${api_key}&input=`

Array.prototype.first = function () {
    return this.length > 0 ? this[0] : null
}

function wolframAPIRequest(url, res, rej) {
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/" + url,
        type: 'GET',
        headers: { 'x-requested-with': 'https://wolframalpha.com' },
        success: function (data) {
            res(data)
        },
        error: function (request, error) {
            rej(error)
        }
    });
}

function wolframGetOutput(raw_xml) {
    var xml = $(raw_xml)
    let answers = xml.children("queryresult").find("plaintext")
    let plaintexts = answers.map(i => { return { "value": answers[i].textContent, "title": answers[i].parentNode.parentNode.attributes[0].textContent } })
    let joined = plaintexts.map((i, t) => { return `[${i + 1}] ${t["title"]} ---------\n${t["value"]}\n\n` }).toArray().join("")
    return joined
}

function wolframGetOutputs(raw_xml) {
    var xml = $(raw_xml)
    let answers = xml.children("queryresult").find("plaintext")
    let plaintexts = answers.map(i => { return { "value": answers[i].textContent, "title": answers[i].parentNode.parentNode.attributes[0].textContent } })
    return plaintexts.toArray()
}

function parseProblem(str) {

    for (i in pathways) {
        let path = pathways[i]
        if (str.includes(path["find"])) {
            return path["func"](str)
        }
    }
}

let pathways = [
    {
        "find": "Find the indefinite integral",
        /** @param {string} input */
        "func": function (input) {
            /** @type {string} */
            var o =
                //Get the inside of the integral, without assuming x is the variable
                //the d\S\S is because it's usually dX∫, but the backup is there too for dX ∫
                ((input.match(/(?=Integral)(.*)(?:d\S\S)/) || []).first() || (input.match(/(?=Integral)(.*)(?:d\S\s)/) || []).first() || input)
                    //Replace blank integrals (if they exist), keeping defined ranges.
                    .replace(/Integral from nothing to nothing/, "Integral of")
                    //remove the dx + integral symbol
                    .replace(/..∫$/, "")
                    //Some basic cleanup, the space afterwards is important
                    .replace(/left parenthesis /g, "(")
                    .replace(/right parenthesis /g, ")")
                    .replace(/Superscript /g, "^")
                    //delete space after variables
                    .replace(/(?<=\W\D)(\s)/gm, "")
                    //delete space after numbers
                    .replace(/(?<=\d+)(\s)/gm, "")
                    .replace(/\^/g, "^(")
                    .replace(/Baseline/g, ")")
                    .replace(/minus/g, " - ")
                    .replace(/plus/g, " + ")
                    .replace(/negative\s/g, "-")
                    .replace(/\ssquared\s/g, "^(2)")
                    .replace(/\s{2,}/g, " ")
            return {
                "parsed":o,
                "handle": function (raw_xml) {
                    let plaintexts = wolframGetOutputs(raw_xml)
                    if (plaintexts.length > 0) {
                        var t = String(plaintexts[0]["value"])
                        //only stuff to the right of the equals
                        .replace(/^.*d\w\s=\s/gm,"")
                        //replace the "+ constant" with + c
                        .replace(/\+ constant/g,"+ c")
                        return t
                    } else {
                        return null
                    }
                }
            }
        }
    }
]
