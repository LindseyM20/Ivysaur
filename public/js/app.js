// event listeners for user.html
$(document).ready(function() {
    let eventForm = $("form.addEvent");
    let event_input = $("input#eventInput");
    let event_time = $("input#eventTime");
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
    $.get("/api/events").then(function(data) {
        let eventTime = data.time
        let event = data.event
        for (i = 0; i < event.length; i++) {
            let addEvent = $("<li>").text("Time: " + eventTime + "Event: " + event).addClass("list-group-item");
            $(".list-group").append(addEvent);
        } 
    })
    $(".date").html(moment().format("dddd, MMMM Do YYYY"));

    $(function() {
        $("#datepicker").datePicker();
        let selectDate = $(".selector").datePicker("getDate");

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
            let eventTime = data.time
            let event = data.event
            for (i = 0; i < event.length; i++) {
                let addEvent = $("<li>").text("Time: " + eventTime + "Event: " + event).addClass("list-group-item");
                $(".list-group").append(addEvent);
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
            date: time,
            taskName: event
        }).then(function(data) {
            console.log("Event Added Successfully: " + data.date + data.taskName)
            location.reload();
        })
    }
});