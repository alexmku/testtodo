
var todolist;



window.onload = function() {
    todolist = new todo_obj();
    todolist.retrieve();
    todolist.visualupdate();
}




function todo_obj() {
    var list = [];

    this.retrieve = function() {
        list = [];
        var locstorlist = localStorage.getItem('todolist');
        if (locstorlist !== null && locstorlist != 'null') {
            locstorlist = JSON.parse(locstorlist);
            locstorlist.forEach(function (itemtask, i) {
                var currenttask = new task_obj(itemtask.name, itemtask.completed);
                list.push(currenttask);
            });
        }
    };

    this.update = function() {
        localStorage.setItem('todolist', JSON.stringify(list));
        this.visualupdate();
    };

    this.visualupdate = function() {
        document.getElementsByClassName("list")[0].innerHTML = '';
        list.forEach(function (itemtask, i) {
            var itemtask = new task_obj(itemtask.name, itemtask.completed);
            itemtask.set(i);
        });
    }



    this.add = function(field) {
        this.retrieve();
        var newtask = new task_obj(field, false);
        list.push(newtask);
        this.update();
    }

    this.delete = function(index) {
        list.splice(index, 1);
        this.update();
    }

    this.completed = function(index) {
        list[index].completed = true;
        this.update();
    }

    this.uncompleted = function(index) {
        list[index].completed = false;
        this.update();
    }

    this.edit = function(index, newname) {
        list[index].name = newname;
        this.update();
    }




    this.showactive = function() {
        /*this.retrieve();
        var newlist = [];
        list.forEach(function (itemtask, i) {
            if (!itemtask.completed)
                newlist.push(itemtask);
        });
        list = newlist;
        this.visualupdate();*/

    }

    this.showcompleted = function() {
        this.retrieve();
        var newlist = [];
        list.forEach(function (itemtask, i) {
            if (itemtask.completed)
                newlist.push(itemtask);
        });
        list = newlist;
        this.visualupdate();
    }

}





function task_obj(name, status) {
  this.name = name;
  this.completed = status ? true: false;

  this.set = function(i) {
    var ullist = document.getElementsByClassName("list");
    var checked, statusclass = '';
    if (this.completed) {
        checked = '<input type="checkbox" class="list--status" value="1" checked data-id=' + i + '>';
        statusclass = ' __completed'
    }
        else {
            checked = '<input type="checkbox" class="list--status" value="0" data-id=' + i + '>';
            statusclass = ' __active';
        }
    var newstring = '<li class="list--item' + statusclass + '"' + 'data-id=' + i + '>' +
                        checked + 
                        '<div class="list--name">' + 
                            '<div class="list--name-inner" data-id=' + i + '>' +  name + '</div>' +
                            '<input type="text" class="list--edit">' + 
                        '</div>' +
                        '<button type="button" class="list--delete" data-id=' + i + '>Удалить</button>' +
                        '</li>';
    ullist[0].innerHTML = ullist[0].innerHTML + newstring;
  };



}




/*--------------------- page controls------------------------------------*/


document.getElementsByClassName('line--add')[0].onclick = function(){
    todolist.add(document.getElementsByClassName("line--field")[0].value);
    document.getElementsByClassName('line--field')[0].value = '';
};

document.getElementsByClassName('line--field')[0]
    .addEventListener('keyup', function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementsByClassName('line--add')[0].click();
    }
});


// task controls -------

document.getElementsByClassName('list')[0].onclick = function(e){
    if (e.target.className == 'list--delete')
        todolist.delete(e.target.getAttribute('data-id'));

    if (e.target.className == 'list--status' && e.target.hasAttribute('checked')){
        todolist.uncompleted(e.target.getAttribute('data-id'));
        //e.target.parentElement.classList.remove('__completed');
    }

    if (e.target.className == 'list--status' && !e.target.hasAttribute('checked')){
        todolist.completed(e.target.getAttribute('data-id'));
        //e.target.parentElement.classList += ' __completed';
    }
};


// task edit -------

document.getElementsByClassName('list')[0].ondblclick = function(e){
    var listitem = e.target.parentElement.parentElement;
    if (e.target.className == 'list--name-inner' && !listitem.classList.contains('__edit')){
        listitem.className += ' __edit';
        e.target.parentElement.getElementsByClassName('list--edit')[0].value = e.target.innerHTML;
    }
}


window.onclick = function(e) {
    var target = document.getElementsByClassName('list--item __edit')[0];
    if (target && !e.target.classList.contains('list--edit')) {
        target.classList.remove('__edit');
        var newname = target.getElementsByClassName('list--edit')[0].value;
        todolist.edit(target.getAttribute('data-id'), newname);
    }
}


// task selector -------

document.getElementById('all').onclick = function(e){
    var cl = document.getElementsByClassName('list')[0].classList;
    cl.remove('__active');
    cl.remove('__completed');
};

document.getElementById('active').onclick = function(e){
    document.getElementsByClassName('list')[0].classList.remove('__completed');
    document.getElementsByClassName('list')[0].classList += ' __active';
};

document.getElementById('completed').onclick = function(e){
    document.getElementsByClassName('list')[0].classList.remove('__active');
    document.getElementsByClassName('list')[0].classList += ' __completed';
};


//----------------------