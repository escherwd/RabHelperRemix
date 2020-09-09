// var url = 'https://www.wolframalpha.com';
// var appid= '6435AA-GV9PA4WPPY';
// var url2 = 'http://api.wolframalpha.com/v2/query?appid='+appid;


// document.addEventListener('DOMContentLoaded', function() {
//   var wolframAlphaButton = document.getElementById('wolframAlpha');


//   wolframAlphaButton.addEventListener('click', function() {
//     var userInput = document.getElementById("userInput").value;
//     const proxyurl = "https://cors-anywhere.herokuapp.com/";
//     var output = url2 + '&input=' + userInput + "&output=json";

//     var bru;
//     var obj;
//     const Http = new XMLHttpRequest();
//     Http.open("GET", proxyurl+output);
//     Http.send();
//     Http.onreadystatechange = (e) => {
//       bru = Http.responseText;
//       obj =JSON.parse(bru);
//       console.log(obj);

//     }

//   //  var out = document.getElementById('bru');
//   //out.innerHTML = bru;

//   }, false);
// }, false);

// document.addEventListener('DOMContentLoaded', function() {
//   var wolframAlphaButton = document.getElementById('newTab');


//   wolframAlphaButton.addEventListener('click', function() {
//     var userInput2 = document.getElementById("userInput").value;
//     var output2 = url + '/input/?i=' + userInput2;

//     window.open(output2, '_blank');

//   }, false);
// }, false);

//DOM Content Loaded
//Add Listeners to all the buttons
$(() => {

  // Click action for "Open in Wolfram Alpha"
  $("#wolframAlpha").click(() => {
    console.log("Open in Wolfram Alpha clicked")
    //get the user input
    let input = $("#userInput").val()
    if (input != null && input != "") {
      //encode the query
      let url = client_input_url + "?i=" + encodeURIComponent(input)
      //open in new tab
      window.open(url, '_blank');
    } else {
      animateCSS('#userInput', 'tada')
    }
  })

  $("#userInput").keypress((e) => {
    if (e.which == 13) {
      $('#solveInline').click()
      return false
    }
  })

  //Click action for "Solve"
  $('#solveInline').click(() => {
    //get the user input
    let input = $("#userInput").val()
    if (input != null && input != "") {
      //encode the query
      let url = api_input_url + encodeURIComponent(input)
      //show loading indicator
      $('#answer-control').addClass("is-loading")
      $('#solveInline').attr("disabled",true)
      //send the request
      wolframAPIRequest(url,(data) => {
        console.log("request succesful")
        $('#answer-control').removeClass("is-loading")
        $('#answer').val(wolframGetOutput(data))
        $('#solveInline').removeAttr("disabled")
      },(error) => {
        console.log("request error")
        console.log(error)
        $('#answer-control').removeClass("is-loading")
        $('#solveInline').removeAttr("disabled")
      })
    } else {
      //"you didn't enter anything" animation
      animateCSS('#userInput', 'tada')
    }
  })

})

