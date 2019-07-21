const ultag = document.getElementById('unorderContactList');
const completedULtag = document.getElementById('completedListUL');

let data = (localStorage.getItem('todolist')) ? JSON.parse(localStorage.getItem('todolist')) : {
    todo: [],
    completed: []
};

function allowDrop(event){
    event.preventDefault();
}

function getCompletedData(event){
    event.preventDefault();
    let lidata = event.dataTransfer.getData("licompl");
    if(lidata !== ""){
        createTODOElements(lidata);
        data.completed.splice(data.completed.indexOf(lidata),1);
        data.todo.push(lidata);
    }

    dataStorage();
}

function getNotCompletedData(event){
    event.preventDefault();
    let lidata = event.dataTransfer.getData("litodo");
    if(lidata !== ""){
        createCompleteElements(lidata);
        data.todo.splice(data.todo.indexOf(lidata),1);
        data.completed.push(lidata);
    }

    dataStorage();
}

function createButtons(isCompleted){

    let buttons = document.createElement('div');
    buttons.classList.add('buttons');

    let del = document.createElement('button');
    del.textContent = '-';
    del.addEventListener('click', deleteList);
    buttons.appendChild(del);
    
    if(!isCompleted){
    let donebtn = document.createElement('button');
    donebtn.textContent = 'Done';
    donebtn.addEventListener('click', completeList);
    buttons.appendChild(donebtn);
    }

    return buttons;
}

function addTodoActivity(str){

    let spantag = document.createElement('span');
    spantag.classList.add('para');
    spantag.innerHTML = str;

    return spantag;
}

function createCompleteElements(str){
    let spantag = addTodoActivity(str);
    let buttontag = createButtons(true);

    let node = document.createElement('li');
    node.classList.add('li-container');
    node.addEventListener('dragstart', function(event){
        event.dataTransfer.setData("licompl",str);
        //event.target.remove();
    });
    node.draggable = true;
    node.appendChild(spantag);
    node.appendChild(buttontag);

    completedULtag.appendChild(node);
}

function createTODOElements(str){
    let spantag = addTodoActivity(str);
    let buttontag = createButtons(false);

    let node = document.createElement('li');
    node.classList.add('li-container');
    node.draggable = true;
    node.addEventListener('dragstart', function(event){
        event.dataTransfer.setData("litodo",str);
        //event.target.remove();
    });
    node.appendChild(spantag);
    node.appendChild(buttontag);

    ultag.appendChild(node);
}

function dataStorage(){
    localStorage.setItem('todolist', JSON.stringify(data));
}

function deleteList(event){

    let div_buttons_parent = event.target.offsetParent;
    let li_parentRow = div_buttons_parent.offsetParent;

    let str = li_parentRow.getElementsByTagName('span')[0].innerHTML;
     if(li_parentRow.parentNode.id === 'unorderContactList'){
        data.todo.splice(data.todo.indexOf(str),1)
     } else if(li_parentRow.parentNode.id === 'completedListUL'){
        data.completed.splice(data.completed.indexOf(str),1)
     }
     
     li_parentRow.remove();

     dataStorage();

}

function completeList(event){

let div_buttons_parent = event.target.offsetParent;
let li_parentRow = div_buttons_parent.offsetParent;
let str = li_parentRow.getElementsByTagName('span')[0].innerHTML;
if(str){
    createCompleteElements(str);

    data.completed.push(str);
    if(data.todo.includes(str)){
        data.todo.splice(data.todo.indexOf(str),1)
    }

    li_parentRow.remove();
}

    dataStorage();

}

function addActivity(event){

    if(event.keyCode === 13){
        let str = document.getElementById('todoList').value;
        if(str){

            createTODOElements(str);

            data.todo.push(str);
            
            dataStorage();
        
            document.getElementById('todoList').value = "";
        }
    } else{
        event.preventDefault();
    }

}

(function domRenderFromLocalStorage(){
    if(data.todo.length > 0){
        data.todo.forEach((value) => {
            createTODOElements(value)
        })
    }
    if(data.completed.length > 0){
        data.completed.forEach((value) => {
            createCompleteElements(value);
        })
    }
})();