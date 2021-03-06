$(document).ready(function() {
    let eventForm = $("form.addEvent");
    let event_input = $("input#eventInput");
    let event_time = $("input#eventTime");
    let addedEvents = $(".list-group")
    let currentDate = $(".date").html(moment().format("YYYY-MM-DD"));
    let userId;

    $.get("/api/user_data").then(function(data) {
        $(".member-name").text(data.email);
        getEvents(data.id, currentDate[0].innerHTML);
        userId = data.id;
    });

    function getEvents (userId, selectedDate) {
        console.log(selectedDate);
        $.get("/api/tasks/" + userId, function(data) {
            addedEvents.empty();
            console.log(data);
            console.log(data.taskTime);
            console.log(data.taskName);
            for (i = 0; i < data.length; i++) {
                if (selectedDate == data[i].eventDate) {
                    let addEvent = $("<li>").text(data[i].taskTime + ": " + data[i].taskName).addClass("list-group-flush list-group");
                    let delButton = $("<button>").text("Delete").attr("dataIndex", data[i].id).addClass("btn delButton");
                    addEvent.append(delButton);
                    addedEvents.append(addEvent);
                };
            };
        refreshDelButtonListener();
        });
    };

    eventForm.on("submit", function(event) {
        event.preventDefault();
        let selectDate = $("#datepicker").val();
        if (selectDate) {
            console.log(selectDate);
            let newEvent = {
                time: event_time.val().trim(),
                event: event_input.val().trim(),
                eventDate: selectDate,
                UserId: userId
            };
            addNewEvent(newEvent.time, newEvent.event, newEvent.eventDate, newEvent.UserId);
            event_input.val("");
            event_time.val("");
        }
        else {
            $(".error").removeClass("d-none").addClass("d-block").text("Please select a date for the event");
        };
        
    });

    function addNewEvent (time, event, eventDate, userId) {
        $.post("/api/newEvent", {
            taskTime: time,
            taskName: event,
            eventDate: eventDate,
            UserId: userId
        }).then(function(data) {
            console.log("Event Added Successfully: " + data.taskTime + data.taskName)
            getEvents(userId, data.eventDate);
        })
    }
    //add click event to view events on different dates without having to add a new event
    // $.get("/api/current_comic").then(function(res) {
    //     $(".comic").attr("src", res.json.img)
    // });
    $.ajax({
        method: "GET",
        url: "https://cors-anywhere.herokuapp.com/https://xkcd.com/info.0.json"
    }).then(function(response) {
        console.log(response);
        $(".comic").attr("src", response.img)
        console.log(response.img)
        // Creating object to send to server.
        let comic = {
            date: currentDate[0].innerHTML,
            comicName: response.title,
            imgURL: response.img,
            postNum: response.num,
            UserId: userId
        }
        saveComic(comic)
    })

    function saveComic(comic) {
        $.post("/api/comic", comic)
        .then(function(data) {
            console.log("Comic added successfully", data);
        });
    }

    $("#datepicker").on("change", function(event) {
        event.preventDefault();
        let newDate = $("#datepicker").val();
        currentDate.empty();
        $(".date").text(newDate);
        console.log(newDate);

        getEvents(userId, newDate);

        $.get("/api/saved_comic/" + newDate).then(function(data) {
            console.log("got this", data)

            if (newDate == data.date) {
                $(".comic").removeAttr("src").attr("src", data.imgURL);
            }
            else {
                getRando(newDate);
            }
        })
        
    })

    function getRando(diffDate) {
        let comicNum = Math.floor(Math.random() * 2380);

        $.ajax({
            method: "GET",
            url: "https://cors-anywhere.herokuapp.com/https://xkcd.com/" + comicNum + "/info.0.json"
        }).then(function(response) {
            $(".comic").removeAttr("src").attr("src", response.img);

            let rando = {
                date: diffDate,
                comicName: response.title,
                imgURL: response.img,
                postNum: response.num,
                UserId: userId
            }

            saveComic(rando);
        });
    };

    function refreshDelButtonListener() {
        $(".delButton").on("click", function(event) {
            event.preventDefault();
            console.log($(this).attr("dataIndex"));
                $.post("/api/task", {
                    id: $(this).attr("dataIndex")
            }).then(
                function(data) {
                    getEvents(userId, $("#datepicker").val());
                }
            );
        });
    }
    
});