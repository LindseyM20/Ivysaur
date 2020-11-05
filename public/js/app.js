// event listeners for user.html
$(document).ready(function() {
    let eventForm = $("form.addEvent");
    let event_input = $("input#eventInput");
    let event_time = $("input#eventTime");

    $(".date").html(moment().format("dddd, MMMM Do YYYY"));

    $(".selector").datepicker({
        currentText: "Now"
    })
    
    let date = $(".selector").datepicker("option", "currentText", "yy-mm-dd")
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get("/api/user_data").then(function(data) {
        $(".member-name").text(data.email);
    });
    // GET request for current comic - http://xkcd.com/info.0.json
    // $.get("/api/current_comic").then(function(res) {
    //     $(".comic").attr("src", res.json.img)
    // });
    $.ajax({
        method: "GET",
        url: "http://xkcd.com/info.0.json"
    }).then(function(response) {
        $(".comic").attr("src", response.json.img)
        console.log(response.json.img)
        // Creating object to send to server.
        let comic = {
            comicName: response.title,
            imgURL: response.img,
            postNum: response.num
        }
        $.post("/api/comic", comic)
        .then(function(data) {
          console.log("Comic added successfully", data);
        });
    })
    $.get("/api/tasks/" + date).then(function(data) {
        let eventTime = data.taskTime
        let event = data.taskName
        let id = data.id
        for (i = 0; i < event.length; i++) {
            let addEvent = $("<li>").text("Time: " + eventTime + "Event: " + event).addClass("list-group-item");
            $(".list-group").append(addEvent);
            addEvent.append("<button>").text("DELETE").addClass("delete").attr("data-index", id);
        } 
    }) 

    $(function() {
        $("#datepicker").datepicker();
        let selectDate = $(".selector").datepicker("getDate");

        let comicNum = Math.floor(Math.random() * 2380);

        $(".comic").attr("src", "");

        $.ajax({
            method: "GET",
            url: "http://xkcd.com/" + comicNum + "/info.0.json"
        }).then(function(response) {
            $(".comic").attr("src", response.json.img)
            // Creating object to send to server.
            let comic = {
                comicName: response.title,
                imgURL: response.img,
                postNum: response.num
            }
            $.post("/api/comic", comic)
            .then(function(data) {
              console.log("Comic added successfully", data);
            });
        })
        // add functionality with date selected
        $.get("/api/tasks").then(function(data) {
            let eventTime = data.taskTime
            let event = data.taskName
            let id = data.id
            for (i = 0; i < event.length; i++) {
                let addEvent = $("<li>").text("Time: " + eventTime + "Event: " + event).addClass("list-group-item");
                $(".list-group").append(addEvent);
                addEvent.append("<button>").text("DELETE").addClass("delete").attr("data-index", id);
            }; 
        });
    });
    eventForm.on("submit", function(event) {
        event.preventDefault();
        let newEvent = {
            time: event_time.val().trim(),
            event: event_input.val().trim()
        };
        addNewEvent(newEvent.time, newEvent.event);
        event_input.val("");
        event_time.val("");
    })

    function addNewEvent (time, event) {
        $.post("/api/newEvent", {
            taskTime: time,
            taskName: event
        }).then(function(data) {
            console.log("Event Added Successfully: " + data.taskTime + data.taskName)
            location.reload();
        })
    }

    $(".delete").on("click", function(event) {
        event.preventDefault();

        $.ajax("/api/task/", {
            id: $(this.data-index),
            type: "DELETE"
        }).then(
            function() {
                console.log("Event deleted " + id)
                location.reload();
            }
        );
    });

    $("#INSERT ID OF LOGOUT BUTTON HERE").on("click", function(event) {
        event.preventDefault();
        $.get("/logout")
    })
});