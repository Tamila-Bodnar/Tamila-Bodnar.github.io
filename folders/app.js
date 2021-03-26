const data = [{
    'folder': true,
    'title': 'Grow',
    'children': [{
        'title': 'logo.png'
      },
      {
        'folder': true,
        'title': 'English',
        'children': [{
          'title': 'Present_Perfect.txt'
        }]
      }
    ]
  },
  {
    'folder': true,
    'title': 'Soft',
    'children': [{
        'folder': true,
        'title': 'NVIDIA',
        'children': null
      },
      {
        'title': 'nvm-setup.exe'
      },
      {
        'title': 'node.exe'
      }
    ]
  },
  {
    'folder': true,
    'title': 'Doc',
    'children': [{
      'title': 'project_info.txt'
    }]
  },
  {
    'title': 'credentials.txt'
  }
];

const rootNode = document.getElementById('root');

let addElements = (elementsArray) => {
  let divParent = document.createElement('div');

  for (let element of elementsArray) {
    let div = document.createElement('div');
    div.classList.add('element');
    let childForText = document.createElement('p');
    let icon = document.createElement('i');
    icon.classList.add('material-icons');
    icon.textContent = 'insert_drive_file';

    let span = document.createElement('span');
    span.textContent = element.title;
    childForText.appendChild(span);
    childForText.insertBefore(icon, span);
    div.appendChild(childForText);
    divParent.appendChild(div);

    if (element.folder) {
      div.classList.remove('element');
      div.classList.add('folder');
      icon.textContent = 'folder';

      if (element.children) {
        let forChildren = addElements(element.children);
        forChildren.hidden = true;
        div.appendChild(forChildren);

      } else {
        let messageThatEmpty = document.createElement('p');
        messageThatEmpty.classList.add('messageThatEmpty');
        messageThatEmpty.textContent = 'Folder is empty';
        messageThatEmpty.hidden = true;
        div.appendChild(messageThatEmpty);
      }
    }
  }

  return divParent;
}

let createTree = () => {
  let treeData = addElements(data);
  treeData.id = 'tree';
  rootNode.appendChild(treeData);
}

let addEvents = () => {

  rootNode.addEventListener('click', (event) => {
    let clickedElement = event.target;
       
    event.preventDefault;
    let menu = document.getElementById('taskMenu');
    if (menu) {
      document.getElementById('taskMenu').remove();
    }
  
    if (clickedElement.classList.contains('rename')) {

      let checkedElement = document.querySelector('#checked');
      checkedElement.firstChild.contentEditable = false;
      checkedElement.lastChild.contentEditable = true;
      
    } else {

      let previousCheckedElement = document.querySelector('#checked');
      if (previousCheckedElement) {
        previousCheckedElement.id = '';
      }
  
      let parentText = clickedElement.parentNode.parentNode;
      let parentIcon = clickedElement.parentNode.parentNode;
      if (parentText) {
        if (parentText.classList.contains('folder')) {
          let children = parentText.lastChild;
          children.toggleAttribute('hidden');
          parentText.firstChild.firstChild.textContent =
            parentText.firstChild.firstChild.textContent === 'folder_open' ?
            'folder' : 'folder_open';
        } else if (parentIcon && parentIcon.classList.contains('folder')) {
          let children = parentIcon.lastChild;
          children.toggleAttribute('hidden');
          clickedElement.textContent = clickedElement.textContent === 'folder_open' ?
            'folder' : 'folder_open';
        }
      }
    }
   
  });

  let createMenu = (event) => {

    event.preventDefault();
    if (document.getElementById('taskMenu')) {
      document.getElementById('taskMenu').remove();
    }

    let taskMenu = document.createElement('div');
    taskMenu.id = 'taskMenu';
    let taskRename = document.createElement('p');
    taskRename.classList.add('task', 'rename');
    taskRename.textContent = 'Rename';
    taskMenu.appendChild(taskRename);
    let taskDelete = document.createElement('p');
    taskDelete.classList.add('task', 'delete');
    taskDelete.textContent = 'Delete';
    taskMenu.appendChild(taskDelete);
    taskMenu.style.left = event.clientX.toString() + 'px';
    taskMenu.style.top = event.clientY.toString() + 'px';
    taskMenu.style.top = event.clientY;
    rootNode.appendChild(taskMenu);
  }

  let contextMenuListener = (element) => {
    element.addEventListener('contextmenu', (event) => {
      createMenu(event);
      element.id = 'checked';

      let menu = document.getElementById('taskMenu');

      menu.addEventListener('click', (event) => {
        let clickedElement = event.target;

        if (clickedElement.classList.contains('task')) {
          if (clickedElement.classList.contains('delete')) {
            let elementTree = element.parentNode;
            let parentTree = elementTree.parentNode;
            if (elementTree.previousSibling === null && elementTree.nextSibling === null) {
              let messageThatEmpty = document.createElement('p');
              messageThatEmpty.classList.add('messageThatEmpty');
              messageThatEmpty.textContent = 'Folder is empty';
              parentTree.appendChild(messageThatEmpty);
            }
            elementTree.remove();
            menu.remove();
          }
        }
      })
    });
  }

  let treeElements = document.querySelectorAll('P');
  for (let i = 0, len = treeElements.length; i < len; i++) {
    let treeElement = treeElements[i];
    contextMenuListener(treeElement);
  }  
}

createTree();
addEvents();