fields = []
class Field{
    constructor(type, position, question, answer) {
      this.type = type;
      this.pos = position;

      this.question = question
      this.answer = answer //för fler och alt (jfr type), loopa igenom svaralternativen
      this.value = []
    }
    changeValue(value){
        this.value = value
        //renderFields()
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
                inp.setAttribute("type", "checkbox");
                inp.classList.add("checkbox");
                inp.classList.add(this.pos);

                //onBlur change the answer atribute on certain checkbox
                inp.id = this.pos + "_" + i
                inp.setAttribute("onClick", "cVal("+ this.pos+")");
                para.appendChild(inp)

                //set label for checkbox
                var label = document.createElement("label");
                label.setAttribute("for", this.pos + "_" + i);
                label.innerHTML = this.answer[i]
                para.appendChild(label)
            }
        }
        if (this.type == "alt"){
            var para = document.createElement("div");
            for(var i = 0; i < this.answer.length; i++){
                var inp = document.createElement("input");
                inp.setAttribute("type", "radio");
                inp.setAttribute("name", this.pos)
                inp.classList.add("radio");
                inp.classList.add(this.pos);

                //onBlur change the answer atribute on certain checkbox
                inp.id = this.pos + "_" + i
                inp.setAttribute("onBlur", "cVal(this.id, this.value)");
                para.appendChild(inp)

                //set label for checkbox
                var label = document.createElement("label");
                label.setAttribute("for", this.pos + "_" + i);
                label.innerHTML = this.answer[i]
                para.appendChild(label)
            }
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

        //sets question
        var titelt = document.createElement("div");
        titelt.innerHTML = this.question;
        para.appendChild(titelt)

        var element = document.getElementById("container");
        element.appendChild(para);

        //add existing answers
        this.renderInput()
    }
}
function cVal(value){
    elems = document.getElementsByClassName(value)
    Val = []
    for(var i = 0; i < elems.length; i++){
        Val.push(elems[i].checked)
    }
    console.log(Val)
    fields[value].changeValue(Val)
}

function renderFields(){
    var element = document.getElementById("container");
    element.innerHTML = ""

    //load data 
    var data = document.getElementById("data").innerHTML
    data = JSON.parse(data)

    //create the titel of form
    var titel = document.createElement("div");
    titel.id = "titel"
    titel.classList.add("field")

    var titel_txt = document.createElement("div");
    titel_txt.innerHTML = data["eventDes"][0]["eventName"]
    titel.appendChild(titel_txt)

    var desc_txt = document.createElement("div");
    desc_txt.innerHTML = data["eventDes"][0]["eventdesc"]
    titel.appendChild(desc_txt)

    container.appendChild(titel)

    for(var i = 0; i < fields.length; i++){
        fields[i].renderField()
    }
}

//function gets called on load and laddar all fields
function init(){
    //load data 
    var data = document.getElementById("data").innerHTML
    data = JSON.parse(data)
    console.log(data)
    
    container = document.getElementById("container")

    //create the fields and add to container
    for(var i = 0; i < data['fields'].length; i++){
        f = data['fields'][i]
        field = new Field(f['type'], f['position'], f['titel'], f['answer'])
        fields.push(field)
    }
    renderFields()
}


