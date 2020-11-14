/* 
Since Im sharing the code, 
you have full access to the function....
but please dont spam with the live version
rest is your choice ^_^
*/

// Firebase Management

var firebaseConfig = {

    apiKey: "<-->",
    authDomain: "<-->",
    databaseURL: "<-->",
    projectId: "<-->",
    storageBucket: "<-->",
    messagingSenderId: "<-->",
    appId: "<-->",
    measurementId: "<-->"

};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

db.settings({ timestampsInSnapshots: true });

// db.collection("cafes").get().then((snapshot) => {

//     snapshot.docs.forEach((doc) => {
//         console.log(doc.data());
//     });
    

// });

// Web Script

// Declaring variables

var documentData;
var currentCode;

// Etc

// $(".section-2-container").addClass("s2c-start");

$("#loadingCode").hide();
$(".notes-pre").show();
$(".notes-container").hide();

$("#codeInput1").keydown(function (e){
    var k = e.keyCode || e.which;
    var ok = k >= 65 && k <= 90 ||  k >= 96 && k <= 105 || k >= 35 && k <= 40 || k == 9 || k == 46 || k == 8 || (!e.shiftKey && k >= 48 && k <= 57);
    if(!ok || (e.ctrlKey && e.altKey)){
        e.preventDefault();
    }
});

$("#cutCodeBtn").on("click", function(){
    $("#codeInput1").val("");
    $(".s-1-circle-A").removeClass("proc-c-2");
});

// Dynamic Styles

$("#superbody").css({"min-height": $(document).height() + "px"});
$(".notes-edit notes-edit-open").css({"min-height": $(document).height() - 50 + "px"});
setTimeout(function(){
    $("#superbody").css({"min-height": $(document).height() + "px"});
    $(".notes-edit notes-edit-open").css({"min-height": $(document).height() - 50 + "px"});
}, 2000);
$("#closeBBNBB").fadeOut(200);

$("#codeInput1").on("input", function(e){

    let thisElVal = e.target.value;    
    if (thisElVal.length == 4){
        $(".s-1-circle-A").addClass("proc-c-2");
    } else {
        $(".s-1-circle-A").removeClass("proc-c-2");
    }
    
});

// Manage tasks

var completeNewList = 2;

function addTask(taskInfo) {

    let div = document.createElement('div');
    div.setAttribute('id', 'tk' + taskInfo.id);
    let innerHtml1 = 
`
<div class="task">
    <div class="task-icon">
        <ion-icon name="calendar-outline"></ion-icon>
    </div>
    <div class="task--box-2">
        <div class="task-heading-1">
`;
    let innerHtml2 = taskInfo.heading;
    let innerHtml3 = 
`
</div>
    <div class="task-sub-1">
`;
    let innerHtml4 = taskInfo.taskText;
    let innerHtml5 =
`
</div>
    </div>
    <div class="task--box-3">
        <div class="task-delete-1">
            <ion-icon name="close"></ion-icon>
        </div>
    </div>
</div>
`;

    let innerHtml = innerHtml1 + innerHtml2 + innerHtml3 + innerHtml4 + innerHtml5;
    div.innerHTML = innerHtml;
    document.querySelector(".tasks-container").appendChild(div);

    $("#" + $(div).attr("id") + " .task--box-3").on("click", function(){
        
        let curClickedID = parseInt($(div).attr("id").replace("tk", ""));
        
        $("#" + $(div).attr("id")).css({
            opacity: 0,
            transform: "translateY(10px)"
        });

        setTimeout(function(){
            $("#" + $(div).attr("id")).animate({
                height: 0
            }, 20);
        }, 400);

        let docRef = db.collection("lists").doc(currentCode);    

        docRef.get().then(function(doc) {

            if (doc.exists) {

                let newListAfterDel = doc.data().tasks;

                if(curClickedID == 0){
                    newListAfterDel.shift();
                    completeNewList = newListAfterDel;
                } else {
                    newListAfterDel.splice(curClickedID, curClickedID);
                    completeNewList = newListAfterDel;
                }

                db.collection("lists").doc(currentCode).update({
                    tasks: newListAfterDel
                })
                .then(function() {

                    showToast("The task was successfully deleted");
                
                })
                .catch(function(error) {
                    // console.error("Error writing document: ", error);
                    showToast("There was an error while writing data");
                });
                
            } else {
                
                showToast("There was an unusual error. Error Code: T560");

            }

        }).catch(function(error) {
            // console.log("There was this error while retrieving data:", error);
            showToast("There was an error while retrieving data");
        });
    
    });

}

function removeTask(taskId) {

    $("#" + taskId).css({
        opacity: 0,
        transform: "scale(0)"
    });
    setTimeout(function(){
        let elem = document.getElementById(taskId);
        elem.parentNode.removeChild(elem);
    }, 200);

}

function clearTask() {
    $(".tasks-container").html("");
}

function showTaskScreen() {
    
    $(".s-1-heading-1").addClass("s-1-heading-1-after-an");
    $(".section-1").addClass("section-1-after-animate");

    // $("#cutCodeBtn").hide();
    // $("#loadingCode").show();

    $("#codeInput1").attr("disabled", "true");

    setTimeout(function () {
        $(".section-2-container").addClass("s2c-start");
        $("#codeInput1").val("");
    }, 400);

    $("#codeDisplayHereTXT").text(currentCode);

    // Show values

    if(documentData == false) {

        $(".notes-pre").show();
        $(".notes-container").hide();

        let today = new Date();
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        $(".s-2-date-1").text(today.getDate() + " " + months[today.getMonth()] + " " +  today.getFullYear());

    } else {

        let today = new Date();
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        $(".s-2-date-1").text(today.getDate() + " " + months[today.getMonth()] + " " +  today.getFullYear());
        
        // if(typeof(documentData.name) == "string"){
        //     $(".section-2-heading-1").text("Welcome, " + documentData.name);
        // }

        if(typeof(documentData.note) == "string"){
            $(".notes-pre").hide();
            $(".notes-container").show();
            $(".note-heading-1").text(documentData.noteHeading);
            $(".note-subhead-1").text(documentData.note);
        } else {
            $(".notes-pre").show();
            $(".notes-container").hide();
        }

        if(typeof(documentData.name) == "string"){
            $("#nameInputTxt").val(documentData.name);
            if(documentData.name.length > 10){
                let maxLength = 10;
                let resultName = $("#nameInputTxt").val().substring(0,  maxLength) + '...';
                $("#nameInputTxt").val(resultName);
            } else{
                $("#nameInputTxt").val(documentData.name);
            }
        } else {
            $("#nameInputTxt").val("Guest");
        }

        if(documentData.tasks == undefined){

        } else {

            clearTask();
            let docData = documentData.tasks;

            setTimeout(function(){
                for (task in docData){
    
                    addTask({
                        id: task,
                        heading: docData[task].split("~")[0],
                        taskText: docData[task].split("~")[1]
                    });
    
                }
            }, 860);

        }
        
    }

}

$("#codeInput1").on("keyup", function(e){
    e.which = e.which || e.keyCode;
    if(e.which == 13) {
        $("#continueWithCodeBtn").click();
    }
});

$("#continueWithCodeBtn").on("click", function(){

    let inputValue = $("#codeInput1").val().toUpperCase();
    
    if(inputValue.length == 4){

        currentCode = inputValue;

        let docRef = db.collection("lists").doc(inputValue);

        $("#cutCodeBtn").hide();
        $("#loadingCode").show();

        docRef.get().then(function(doc) {

        if (doc.exists) {
            documentData = doc.data();
            // console.log("Document data (it exists):", doc.data());
            // var name = doc.get('name');
            // console.log(name);
            setTimeout(function(){
                showTaskScreen();
            })

        } else {

            db.collection("lists").doc(currentCode).set({
                code: currentCode
            })
            .then(function() {
                documentData = {code: currentCode};
                // console.log("Document does not exists!");
                setTimeout(function(){
                    showTaskScreen();
                })
            })
            .catch(function(error) {
                showToast("There was an error while writing data");
            });
        }

        }).catch(function(error) {
        // console.log("There was this error while retrieving data:", error);
        showToast("There was an error while retrieving data:");
        });

    } else {

        showToast("The pin is supposed to be of 4 characters");

    }

});

$(".section-2").scroll(function () {
  
    if($(this).scrollTop() == 0){
        $(".navbar").css("box-shadow", "0 0px 0px transparent");
    } else {
        $(".navbar").css("box-shadow", "0 4px 6px rgb(213 221 255 / 26%)");
    }
    
});

$(".nav-1").on("click", function(){

    $(".superbody").css({
        transform: "translateX(90%)",
        filter: "brightness(0.5)"
    });
    $(".side-menu").css({
        transform: "translateX(0px)"
    });

});

$(".side-m-c-c-3").on("click", function(){

    $(".superbody").css({
        transform: "translateX(0px)",
        filter: "brightness(1)"
    });
    $(".side-menu").css({
        transform: "translateX(-768px)"
    });

});

$('#codeInput1').on('input', function(){
    if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);
});

$('#noteHeadingTxt').on('input', function(){
    if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);
});

$('#fullNoteTxt').on('input', function(){
    if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);
});

$('#nameInputTxt').on('input', function(){
    if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);
});

$('#taskHeading2').on('input', function(){
    if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);
});

$('#taskFullTxt2').on('input', function(){
    if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);
});

$(".th2-B").on("click", function(){

    let noteRef = db.collection('lists').doc(currentCode);

    let removeNote = noteRef.update({
        tasks: firebase.firestore.FieldValue.delete()
    });
    
    let tasksNo = $(".tasks-container").children().length;
    for (let i = 0; i <= tasksNo; i++){
        
        $("#tk" + i).animate({
            opacity: 0,
            transform: "translateY(10px)"
        }, 400);

    }

    setTimeout(function(){
        $(".tasks-container").html("");
        showToast("All tasks were cleared successfully");
    }, 400);

});

$(".notes-pre").on("click", function(){

    if(!($(".nav-1").css("display") == "none")){
        if($(".nav-1").css("opacity") == 1){
        
            $(".nav-1").fadeOut(100);
            $(".nav-2").fadeOut(100);
            setTimeout(function(){
                $("#closeBBNBB").fadeIn(0);
            }, 100);
            setTimeout(function(){
                $("#closeBBNBB").css({
                    transform: "translateX(0px)",
                    opacity: 1
                });
            }, 200);
            $(".notes-edit").addClass("notes-edit-open");
            
        }
    }

});

$("#closeBBNBB").on("click", function(){

    $("#closeBBNBB").css({
        transform: "translateX(10px)",
        opacity: 0
    });
    setTimeout(function(){
        $("#closeBBNBB").fadeOut(100);
    }, 400);
    setTimeout(function(){
        $(".nav-1").fadeIn(400);
        $(".nav-2").fadeIn(400);
    }, 600);
    
    $(".notes-edit").removeClass("notes-edit-open");
    $(".add-task").removeClass("add-task-open");

});

$(".nic1-1").on("click", function(){

    if(!($(".nav-1").css("display") == "none")){
        if($(".nav-1").css("opacity") == 1){
        
            $(".nav-1").fadeOut(100);
            $(".nav-2").fadeOut(100);
            setTimeout(function(){
                $("#closeBBNBB").fadeIn(0);
            }, 100);
            setTimeout(function(){
                $("#closeBBNBB").css({
                    transform: "translateX(0px)",
                    opacity: 1
                });
            }, 200);
            $(".notes-edit").addClass("notes-edit-open");
            
        }
    }

});

$(".nic1-2").on("click", function(){
    
    let noteRef = db.collection('lists').doc(currentCode);

    let removeNote = noteRef.update({
        note: firebase.firestore.FieldValue.delete(),
        noteHeading: firebase.firestore.FieldValue.delete()
    });

    $(".notes-container").fadeOut(400);
    $(".notes-pre").css({
        opacity: 0,
        transform: "translateY(10px)"
    });
    setTimeout(function(){
        $(".notes-pre").fadeIn(0);
        $(".notes-pre").css({
            opacity: 1,
            transform: "translateY(0px)"
        });
    }, 420);

});

$(".nehc1--input-A").on("focus focusin", function(){
    $(this).css({
        color: "#4a70f9",
        background: "#ffffff",
        border: "2px solid #ffffff"
    });
});

$(".nehc1--input-A").on("blur focusout", function(){
    $(this).css({
        color: "white",
        background: "#5882fa",
        border: "2px solid #5882fa"
    });
});

$(".nehc1--input-A--B").on("focus focusin", function(){
    $(this).css({
        color: "#4a70f9"
    });
    $(".nehc1-B--BB").css({
        background: "white",
        border: "2px solid #ffffff"
    });
});

$(".nehc1--input-A--B").on("blur focusout", function(){
    $(this).css({
        color: "white"
    });
    $(".nehc1-B--BB").css({
        background: "#5882fa",
        border: "2px solid #5882fa"
    });
});

// New Declarations

var prevNameTxt = $("#nameInputTxt").val();

var noteHeadingTxt;
var fullNoteTxt;

var taskHeadingTxt;
var taskCompleteTxt;

$("#submitNoteBtn2").on("click", function(){

    if(!($("#noteHeadingTxt").val().length == "")){
        if(!($("#fullNoteTxt").val().length == "")){
            if($("#noteHeadingTxt").val().length < 100){
                if($("#fullNoteTxt").val().length < 220){

                    noteHeadingTxt = $("#noteHeadingTxt").val();
                    fullNoteTxt = $("#fullNoteTxt").val();

                    $("#noteHeadingTxt").attr("disabled", "true");
                    $("#fullNoteTxt").attr("disabled", "true");

                    db.collection("lists").doc(currentCode).update({
                        noteHeading: $("#noteHeadingTxt").val(),
                        note: $("#fullNoteTxt").val()
                    })
                    .then(function() {

                        $("#noteHeadingTxt").val("");
                        $("#fullNoteTxt").val("");
                        $("#noteHeadingTxt").removeAttr("disabled");
                        $("#fullNoteTxt").removeAttr("disabled");

                        if(!($("#closeBBNBB").css("opacity") == 0)){

                            $("#closeBBNBB").css({
                                transform: "translateX(10px)",
                                opacity: 0
                            });
                            setTimeout(function(){
                                $("#closeBBNBB").fadeOut(100);
                            }, 400);
                            setTimeout(function(){
                                $(".nav-1").fadeIn(400);
                                $(".nav-2").fadeIn(400);
                            }, 600);

                            setTimeout(function () {
                                $(".notes-pre").css({
                                    transform: "translateY(20px)",
                                    opacity: 0
                                });
                                $(".notes-container").css({
                                    transform: "translateY(20px)",
                                    opacity: 0
                                });
                            }, 600);
                            setTimeout(function () {
                                $(".notes-pre").fadeOut(0);
                                $(".notes-container").fadeIn(0);
                            }, 800);
                            setTimeout(function (){
                                $(".notes-container").css({
                                    transform: "translateY(0px)",
                                    opacity: 1
                                });
                            }, 820)
                            
                            $(".notes-edit").removeClass("notes-edit-open");

                        }

                        $(".note-heading-1").text(noteHeadingTxt);
                        $(".note-subhead-1").text(fullNoteTxt);

                    })
                    .catch(function(error) {
                        // console.error("Error writing document: ", error);
                        showToast("There was an error while writing data");
                    });

                }
            }
        }
    }

});

function showToast(msg){
    $(".bottom-toast").text(msg);
    $(".bottom-toast").addClass("bottom-toast-open");
    setTimeout(function(){
        $(".bottom-toast").removeClass("bottom-toast-open");
    }, 2400);
}

$("#nameInputTxt").on("focus focusin", function(){
    prevNameTxt = $("#nameInputTxt").val();
});

$("#nameInputTxt").on("blur focusout", function(){
    
    if(($("#nameInputTxt").val() == "")){
        $("#nameInputTxt").val(prevNameTxt);
    } else{
        if($("#nameInputTxt").val().length > 10){
            let maxLength = 10;
            let resultName = $("#nameInputTxt").val().substring(0,  maxLength) + '...';
            $("#nameInputTxt").val(resultName);
        } else{
            $("#nameInputTxt").val($("#nameInputTxt").val());
        }
    
        db.collection("lists").doc(currentCode).update({
            name: $("#nameInputTxt").val()
        })
        .then(function() {
    
            showToast("Your name was saved successfully!");
    
        })
        .catch(function(error) {
            // console.error("Error writing document: ", error);
            showToast("There was an error while writing data");
        });
    }

});

$("#sm1").on("click", function(){

    $(".superbody").css({
        transform: "translateX(0px)",
        filter: "brightness(1)"
    });
    $(".side-menu").css({
        transform: "translateX(-768px)"
    });

    setTimeout(function(){
        $(".nav-1").fadeOut(100);
        $(".nav-2").fadeOut(100);
        setTimeout(function(){
            $("#closeBBNBB").fadeIn(0);
        }, 100);
        setTimeout(function(){
            $("#closeBBNBB").css({
                transform: "translateX(0px)",
                opacity: 1
            });
        }, 200);
        $(".notes-edit").addClass("notes-edit-open");
    }, 320);

});

$("#sm2").on("click", function(){

    // $(".superbody").css({
    //     transform: "translateX(0px)",
    //     filter: "brightness(1)"
    // });
    // $(".side-menu").css({
    //     transform: "translateX(-768px)"
    // });

    if($("#darkStyle").attr("media") == "max-width=1px"){
        $("#darkStyle").attr("media", "");
    } else {
        $("#darkStyle").attr("media", "max-width=1px");
    }

    // setTimeout(function () {
    //     $(".superbody").css({
    //         filter: "invert(1)"
    //     });
    // }, 420)

});

$("#sm6").on("click", function(){

    currentCode = "";
    $(".superbody").css({
        transform: "translateX(0px)",
        filter: "brightness(1)"
    });
    $(".side-menu").css({
        transform: "translateX(-768px)"
    });

    setTimeout(function () {

        $(".section-2-container").removeClass("s2c-start");
        $("#codeInput1").val("");

        $("#loadingCode").hide();
        $("#cutCodeBtn").show();

        $("#codeInput1").removeAttr("disabled");

        setTimeout(function () {
            $(".s-1-heading-1").removeClass("s-1-heading-1-after-an");
            $(".section-1").removeClass("section-1-after-animate");
        }, 400);

    }, 400);

});

$(".th2-C").on("click", function(){

    if(!($(".nav-1").css("display") == "none")){
        if($(".nav-1").css("opacity") == 1){

            if(!(completeNewList == 2)){
                setTimeout(function(){

                    clearTask();
                    let docData = completeNewList;
                    for (task in docData){
                        addTask({
                            id: task,
                            heading: docData[task].split("~")[0],
                            taskText: docData[task].split("~")[1]
                        });
                    }
                    completeNewList = 2;

                }, 320)
            }
        
            $(".nav-1").fadeOut(100);
            $(".nav-2").fadeOut(100);
            setTimeout(function(){
                $("#closeBBNBB").fadeIn(0);
            }, 100);
            setTimeout(function(){
                $("#closeBBNBB").css({
                    transform: "translateX(0px)",
                    opacity: 1
                });
            }, 200);
            $(".add-task").addClass("add-task-open");
            
        }
    }

});

$(".nehc1--input-A__B").on("focus focusin", function(){
    $(this).css({
        color: "#4a70f9",
        background: "#ffffff",
        border: "2px solid #ffffff"
    });
});

$(".nehc1--input-A__B").on("blur focusout", function(){
    $(this).css({
        color: "white",
        background: "#5882fa",
        border: "2px solid #5882fa"
    });
});

$(".nehc1--input-A--B__B").on("focus focusin", function(){
    $(this).css({
        color: "#4a70f9"
    });
    $(".nehc1-B--BB__B").css({
        background: "white",
        border: "2px solid #ffffff"
    });
});

$(".nehc1--input-A--B__B").on("blur focusout", function(){
    $(this).css({
        color: "white"
    });
    $(".nehc1-B--BB__B").css({
        background: "#5882fa",
        border: "2px solid #5882fa"
    });
});

var newTasksArray;
var newTaskInfo;

$("#addTaskBtn2").on("click", function(){

    if(!($("#taskHeading2").val().length == "")){
        if(!($("#taskFullTxt2").val().length == "")){
            if($("#taskHeading2").val().length < 100){
                if($("#taskFullTxt2").val().length < 220){

                    taskHeadingTxt = $("#taskHeading2").val();
                    taskCompleteTxt = $("#taskFullTxt2").val();

                    $("#taskHeading2").attr("disabled", "true");
                    $("#taskFullTxt2").attr("disabled", "true");

                    $("#taskHeading2").val("");
                    $("#taskFullTxt2").val("");

                    let docRef = db.collection("lists").doc(currentCode);    

                    docRef.get().then(function(doc) {

                        if (doc.exists) {

                            let tasks;
                            tasks = doc.data().tasks;

                            if(typeof(tasks) == "undefined"){
                                newTasksArray = [];
                            }else{
                                newTasksArray = tasks;
                            }
                            // let newTasksArray = tasks.tasks ? tasks.tasks : [];
                            let valueToPush;

                            valueToPush = taskHeadingTxt.replace("~", "").trim() + "~" + taskCompleteTxt.replace("~", "").trim();

                            newTasksArray.push(valueToPush);

                            newTaskInfo = {
                                id: newTasksArray.length,
                                heading: newTasksArray[newTasksArray.length - 1].split("~")[0],
                                taskText: newTasksArray[newTasksArray.length - 1].split("~")[1]
                            }

                            documentData.tasks = newTasksArray;

                            db.collection("lists").doc(currentCode).update({
                                tasks: newTasksArray
                            })
                            .then(function() {

                                $("#closeBBNBB").css({
                                    transform: "translateX(10px)",
                                    opacity: 0
                                });
                                setTimeout(function(){
                                    $("#closeBBNBB").fadeOut(100);
                                }, 400);
                                setTimeout(function(){
                                    $(".nav-1").fadeIn(400);
                                    $(".nav-2").fadeIn(400);
                                    addTask(newTaskInfo);
                                }, 600);

                                $("#taskHeading2").removeAttr("disabled");
                                $("#taskFullTxt2").removeAttr("disabled");
                                
                                $(".notes-edit").removeClass("notes-edit-open");
                                $(".add-task").removeClass("add-task-open");
                            
                            })
                            .catch(function(error) {
                            // console.error("Error writing document: ", error);
                            showToast("There was an error while writing data");
                            });
                            
                        } else {
                            let tasks;
                            tasks = false;
                        }

                        // addTask({
                        //     id: task,
                        //     heading: docData[task].split("~")[0],
                        //     taskText: docData[task].split("~")[1]
                        // });

                    }).catch(function(error) {
                        // console.log("There was this error while retrieving data:", error);
                        showToast("There was an error while retrieving data");
                        $("#taskHeading2").removeAttr("disabled");
                        $("#taskFullTxt2").removeAttr("disabled");
                    });

                }
            }
        }
    }

});

$(".nav-2").on("click", function(){
    $(".th2-C").click();
});

