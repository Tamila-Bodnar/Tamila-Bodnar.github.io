const $list = $(".list");
const $input = $("#add-input");
const $add = $("#add-submit");

const todos = [{
    text: "Buy milk",
    done: false
  },
  {
    text: "Play with dog",
    done: true
  }
];

function changeDone(el) {
  let text = $(el).text();
  for (let val of todos) {
    if (val.text === text) {
      val.done = !val.done;
    }
  }
}

function deleteTask(el) {
  let text = $(el).parent().find('.item-text').text();
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].text === text) {
      todos.splice(i, 1);
    }
  }
}

(function ($) {
  $.fn.todolist = function () {
    $add.click(function (e) {
      if ($input.val() !== '') {
        let newTask = $input.val();
        let task = {
          text: newTask,
          done: false
        };
        todos.push(task);
        let taskHTML = $('<li>');
        $(taskHTML).addClass('item');
        let taskText = $('<span>', {
          'class': 'item-text',
          text: newTask
        });
        $(taskText).on('click', function () {
          $(this).toggleClass('done');
          changeDone(this);
        });
        let taskDelete = $('<button>', {
          'class': 'item-remove',
          text: 'Remove'
        });
        $(taskDelete).on('click', function () {
          $(this).parent().remove();
          deleteTask(this);
        });
        $(taskHTML).prepend(taskText, taskDelete);
        $list.prepend(taskHTML);
        $input.val('');

      }
      return false;
    });
    $(".item-remove").on('click', function (e) {
      $(this).parent().remove();
      deleteTask(this);
    })
    $('.item-text').on('click', function () {
      $(this).toggleClass('done');
      changeDone(this);
    });
    
    return this;
  };
}(jQuery));

$().ready(function () {
  let clearSelection = function() {
    let tasks = $('.item-text.search-text');
    if (tasks.length) {
      for (let i = 0; i <= tasks.length - 1; i++) {
        $(tasks[i]).removeClass('search-text');
      }
    }
  } 
  $('.clear-selection').on('click', function(){
    clearSelection();
  });

  $('#search-submit').on('click', function () {
    let searchTask = $('#search-input').val().trim();
    let foundTask;
    if (searchTask !== '') {
      $.each(todos, function (index, value) {
        if (value.text.indexOf(searchTask) !== -1) {
          foundTask = $(`.item-text:contains("${searchTask}")`);

        }
      });
      localStorage.setItem('SpecialTask', searchTask);
      clearSelection();
      $(foundTask).addClass('search-text');
      $('#search-input').val('');
    }

    return false;
  });
  $().todolist();
})