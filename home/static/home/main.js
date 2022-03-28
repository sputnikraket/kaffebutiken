fields = []
activeLabel = 0
class Field{
    constructor(type, position) {
      this.type = type;
      this.pos = position; //position in the fields list

      this.question = "Question"
      this.answer = [] //för fler och alt (jfr type), loopa igenom svaralternativen
    }
    //type commands
    changeType(value){
        this.type = value
        renderFields()
    }
    //qustion commands
    changeQuestion(value){
        this.question = value
        renderFields()
    }
    //answer commands
    addAnswer(){
        this.answer.push("answer" + (parseInt(this.answer.length) + 1))
    }

    changeAnswer(index, value){
        this.answer[index] = value
        renderFields()
    }

    changeAnsPos(index, newpos){
        //inserts the answer in the array 
        this.answer.splice(newpos, 0, this.answer[index])

        //deletes the old, if newpos < index index kommer att förskjutas 1
        tmp = index
        if (newpos < index){
            tmp += 1
        }
        this.answer.splice(tmp, 1)


        renderFields()
    }

    //creating the field, åberopad av renderFields() i fields ordning. 
    renderInput(){
        //txt "txt", flerval(kan välja alla) "fler", alternativ(kan välja en) "alt".
        var para
        if (this.type == "txt"){
            var para = document.createElement("input");
            para.setAttribute("type", "text");
            para.setAttribute("placeholder", "svar");
            para.classList.add("text");
        }
        if (this.type == "fler"){
            var para = document.createElement("div");
            for(var i = 0; i < this.answer.length; i++){
                var inp = document.createElement("input");
                inp.setAttribute("type", "text");
                inp.setAttribute("placeholder", this.answer[i]);
                inp.classList.add("checkbox");

                //onBlur change the answer atribute on certain checkbox
                inp.id = this.pos + "_" + i
                inp.setAttribute("onBlur", "cAns(this.id, this.value); event.stopPropagation()");
                para.appendChild(inp)
            }
        }
        if (this.type == "alt"){
            var para = document.createElement("input");
            para.setAttribute("type", "text");
            para.classList.add("radio");

            //add answer
            var ans = document.createElement("input");
            ans.setAttribute("type", "text");
            ans.setAttribute("placeholder", "add answer");
            para.appendChild(ans)
        }
        if(para != undefined){
            var element = document.getElementById(this.pos)
            element.appendChild(para)
        }
    }

    renderField(){
        var para = document.createElement("div");
        //para.setAttribute("type", "div");
        para.classList.add("field");
        para.id = this.pos
        para.addEventListener("click", function( e ){
            e = window.event || e; 
            if(this === e.target) {
                addTools(this.id)
            }
        });

        //sets question
        var titelt = document.createElement("input");
        titelt.setAttribute("type", "text");
        titelt.id = this.pos
        titelt.setAttribute("placeholder", this.question);
        titelt.setAttribute("onBlur", "cQues(this.id, this.value)")
        para.appendChild(titelt)

        var element = document.getElementById("container");
        element.appendChild(para);

        //add existing answers
        this.renderInput()

        //handle the labelTools
        if(activeLabel == this.pos){
            //add type selector 
            var typeSelec = document.createElement("select");
            typeSelec.setAttribute("onchange", "cType("+ activeLabel+", this.value)")

            var optT = document.createElement("option");
            optT.setAttribute("value", "txt")
            optT.innerHTML = "text"
            typeSelec.appendChild(optT)

            var optF = document.createElement("option");
            optF.setAttribute("value", "fler")
            optF.innerHTML = "fler"
            typeSelec.appendChild(optF)

            var optA = document.createElement("option");
            optA.setAttribute("value", "alt")
            optA.innerHTML = "Alt"
            typeSelec.appendChild(optA)

            para.appendChild(typeSelec)

            //add answer if type is fler or alt, and is active 
            if(this.type == "fler" || this.type == "alt"){
                var ans = document.createElement("input");
                ans.setAttribute("type", "text");
                ans.setAttribute("placeholder", "add answer");
                //console.log(fields[this.pos])
                ans.id = this.pos
                ans.setAttribute("onClick", "add(this.id)");
                para.appendChild(ans)
            }

            //add delete for label 
            var delLabel = document.createElement("button");
            delLabel.setAttribute("onClick", "delLabel(" + this.pos + ")")
            para.appendChild(delLabel)
            //add delete for answer
            var delAns = document.createElement("button");
            delAns.setAttribute("onClick", "delLabel(" + this.pos + ")")
            para.appendChild(delAns)
        }
    }
}

//change funtion 
function cType(id, value){
    fields[id].changeType(value)
}
function cQues(id, value){
    fields[id].changeQuestion(value)
}

function add(id){
    fields[id].addAnswer()
    renderFields()
}

function cAns(id, value){
    console.log(value)
    fId = id.split("_");
    console.log(fId[0])
    fields[fId[0]].changeAnswer(fId[1], value)

}
//delete funtions 
function delLabel(value){
    fields.splice(value, 1)
    renderFields()
}

//init
/* load the fields in the event
function initFields(){

}*/

function createField(){
    field = new Field("fler", fields.length)
    fields.push(field)
    field.renderField()   
}

function renderFields(){
    var element = document.getElementById("container");
    element.innerHTML = ""

    for(var i = 0; i < fields.length; i++){
        fields[i].pos = i
        fields[i].renderField()

    }
}

//handle the field tools on focus 
function addTools(value){
    //set the active label and then render 
    activeLabel = value
    renderFields()
}

//submits form 
function send(){
    let event = {}
    event['fields'] = []
    event['eventDes'] = []
    for(var i = 0; i < fields.length; i++){
        event['fields'].push({
            'titel': fields[i].question,
            'type': fields[i].type,
            'answer': fields[i].answer,
            'position': fields[i].pos,
        })
        console.log(event)
    }
    event['eventDes'].push({
        'eventName': "test",
        'eventdesc': "description",
    })
    
    document.getElementById("id_data").value = JSON.stringify(event)
    document.getElementById("submit-form").submit()

    /*
    $(document).on('submit', '#post-number', function(e){
        e.preventDefault();
        $.ajax({
            type:'POST',
            url:'/code',
            data:{
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            success: function (data){
                console.log(data)
                $('#code-current').html(data);
            },
            error: function($xhr){
                $('#code-current').html($xhr.responseText);
                console.log("fail")
            }
        }); 
    });
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/newevent/", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(event));*/
}