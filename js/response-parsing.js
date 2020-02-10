function wolframAPIRequest(url,res,rej) {
    $.ajax({
        url : "https://cors-anywhere.herokuapp.com/"+url,
        type : 'GET',
        success : function(data) {              
            res(data)
        },
        error : function(request,error)
        {
            rej(error)
        }
    });
}

function wolframGetOutput(raw_xml) {
    var xml = $( raw_xml )
    let answers = xml.children("queryresult").find("plaintext")
    let plaintexts = answers.map (i => { return { "value": answers[i].textContent, "title": answers[i].parentNode.parentNode.attributes[0].textContent }})
    let joined = plaintexts.map((i,t) => { return `[${i+1}] ${t["title"]} ---------\n${t["value"]}\n\n` }).toArray().join("")
    return joined
}