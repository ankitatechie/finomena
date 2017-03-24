(function() {
    //global variables
    var store;
    var userInfo = {
        allAns: [],
        rightAns: 0,
        wrongAns: 0,
        userName: null,
        clicks: 0
    }

    //fetch data from json file
    $.getJSON("data/data.json", function(data){ 
        store = data;
    });

    //layout of ques structure
    function displayques(i) {
        $('#ques-para').text(store[i].ques);
        $('#option1').text(store[i].option1);
        $('#option2').text(store[i].option2);
    };

    //change div on submit click
    $('#submit').on('click',function(e) {
        e.preventDefault();
        if ($("#name").val().length > 0) {
            userInfo.userName =  $("#name").val(); //retrive name 
            $('#home').hide();
            $('#ques-layout').show();
            displayques(0);
        } else {
            $('.js-required').show();
        }
    });
   
    
    //onclick of option inc counter
    function incCounter() {
      if (userInfo.clicks < store.length-1) {
            userInfo.clicks++;
            displayques(userInfo.clicks);
        } else { //after ques display result
            $('#ques-layout').hide();
            $('#result-layout').show();
            displayResult();
        }
    };

    //fetching user answer
    $('.option').on('click', function(e) {
        userInfo.allAns.push(e.target.innerHTML);
        incCounter();
    });
    
    //calculating right and wrong ans & display on result div
    function displayResult() {
        for (var i = 0; i < userInfo.allAns.length; i++) {
            if (userInfo.allAns[i] === store[i].right){
                 userInfo.rightAns += 1;
            } else {
                 userInfo.wrongAns += 1;
            }
        }
        graphmaker(userInfo);

        for (var i = 0; i <=4; i++){
            var questSet = '';
            questSet += "<div class='result__box' ><p class='question'>"+ store[i].ques +"</p>";
            if (userInfo.allAns[i] === store[i].right){
                questSet += "<p class='useranswer'>"+ userInfo.allAns[i] +"</p></div>";
            } 
            else{
                questSet += "<p class='useranswer'>" + userInfo.allAns[i] + "</p>" + "<p class='rightanswer'>" + store[i].right + "</p></div>";
            }
            $('.result-ques').append(questSet);                
        }
        $('#userName').text(userInfo.userName);
        $('.wrapper').hide();
    }
    
    //graph design
    function graphmaker(userInfo) {
        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ["Right", "Wrong"],
            datasets: [{
              backgroundColor: [
                "#10963c",
                "#ff3b3b"
              ],
              data: [userInfo.rightAns, userInfo.wrongAns]
            }]
          }
        });
    };
   
   //ripple effect
    $("ul li").click(function(e) {
        var elem, ink, d, x, y;
        elem = $(this);
        //create .ink element if it doesn't exist
        if (elem.find(".ink").length == 0)
            elem.prepend("<span class='ink'></span>");
            
        ink = elem.find(".ink");
        //incase of quick double clicks stop the previous animation
        ink.removeClass("animate");
        
        //set size of .ink
        if (!ink.height() && !ink.width()) {
            //use parent's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
            d = Math.max(elem.outerWidth(), elem.outerHeight());
            ink.css({height: d, width: d});
        }
        
        //get click coordinates
        //logic = click coordinates relative to page - parent's position relative to page - half of self height/width to make it controllable from the center;
        x = e.pageX - elem.offset().left - ink.width()/2;
        y = e.pageY - elem.offset().top - ink.height()/2;
        
        //set the position and add class .animate
        ink.css({top: y+'px', left: x+'px'}).addClass("animate");
    });
})();  
