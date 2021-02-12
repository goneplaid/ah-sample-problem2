/*
  Hhbuilder Sample Application - Ad Hoc homework assignment
  https://homework.adhoc.team/hhbuilder/

  This script sets up the provided index.html page as a simple mini-application.
  It meets the following requiremnts as outlined in the README:

    * Validate data entry (age is required and > 0, relationship is required)
    * Add people to a growing household list
    * Reset the entry form after each addition
    * Remove a previously added person from the list
    * Display the household list in the HTML as it is modified
    * Serialize the household as JSON upon form submission as a fake trip to the server

  EXPLANATION OF THIS SCRIPT

  The entry point for this mini-application starts with adding an event listener for
  "DOMContentLoaded". From there, additional event listeners are added to the DOM to facilitate
  responding to user input.

  As the user interacts with the appliction and the required validations are executed, the
  UI is updated accordinting.
*/

// ENTRY POINT

// This area establishes event handlers once the DOM is full loaded. It adds style to the
// document and then adds a few hooks to form events that handle the application logic.

document.addEventListener("DOMContentLoaded", function () {
  setApplicationStyle();

  var uiRefs = getUiRefs();

  insertMembersHeader(uiRefs);
  insertMembersPlaceholder(uiRefs);

  document.querySelector('.add').addEventListener('click', handleAdd);
  document.querySelector('button[type="submit"]').addEventListener('click', handleSubmit);
});



// EVENT HANDLERS

function handleAdd(event) {
  event.preventDefault();

  var member = gatherInputValues(
    getUiRefs().form,
    ['age', 'rel', 'smoker']
  );

  var validations = {
    required: ['age', 'rel'],
    messages: {
      age: 'The age field is required.',
      rel: 'The relationship field is required.',
    },
    customValidations: [
      function (data) {
        var isAgeValid = +data.age > 0;

        if (!isAgeValid) {
          alert('Age must be greater than zero.');
        }

        return isAgeValid;
      }
    ],
  };

  if (!isDataValid(member, validations)) return;

  addMember(member);
}

function handleSubmit(event) {
  event.preventDefault();

  alert('do you even code, bro?');
}



// UI CONCERNS

var smokerEmojis = {
  on: 0x1F6AC,
  off: 0x1F6AD,
}

var relativeEmojis = {
  child: 0x1F9D2,
  grandparent: 0x1F475,
  other: 0x1F47D,
  parent: 0x1F469,
  self: 0x1F91A,
  spouse: 0x1F48D,
};

var relativeLabels = {
  child: 'Child',
  grandparent: 'Grandparent',
  other: 'Other',
  parent: 'Parent',
  self: 'Self',
  spouse: 'Spouse',
};

function insertMembersHeader(uiRefs) {
  var headerListItem = dom.create('li', {
    className: 'header',
  });

  headerListItem.append('Family Members');
  uiRefs.list.appendChild(headerListItem);

  return headerListItem;
}

function insertMembersPlaceholder(uiRefs) {
  var placeholderListItem = dom.create('li', { className: 'placeholder' });
  placeholderListItem.append('You have not added any family members yet.');

  uiRefs.list.appendChild(placeholderListItem);
}

function addMember(member) {
  var memberListNode = dom.create('li', { className: 'member' });

  var relative = dom.createAndAppendTo('div', memberListNode);
  var relativeFigure = dom.createAndAppendTo('figure', relative);
  relativeFigure.append(String.fromCodePoint(relativeEmojis[member.rel]));

  var relativeLabel = dom.createAndAppendTo('label', relative);
  relativeLabel.append(relativeLabels[member.rel]);

  var age = dom.createAndAppendTo('span', memberListNode);
  age.append('23 years old');

  var smoker = dom.createAndAppendTo('div', memberListNode);
  var smokerLabel = dom.createAndAppendTo('label', smoker);
  smokerLabel.append('Smoker?');

  var smokerFigure = dom.createAndAppendTo('figure', smoker);
  smokerFigure.append(String.fromCodePoint(smokerEmojis[member.smoker]));

  getUiRefs().list.appendChild(memberListNode);
}



// FORM & VALIDATION RELATED FUNCTIONS

function gatherInputValues(form, items) {
  var values = {};

  items.forEach(function (elementName) {
    var selector = ['[name="', elementName, '"]'].join('');
    var element = form.querySelector(selector);

    values[elementName] = element.value;
  });

  return values;
}

function isDataValid(data, options) {
  if (!(data && options)) return true;

  var isValid = true;

  if (options.required) {
    options.required.forEach(function (valueName) {
      if (!data[valueName].length) {
        alert(options.messages[valueName]);

        isValid = false;
      }
    });
  }

  if (options.customValidations) {
    options.customValidations.forEach(function (isValidationPassing) {
      if (!isValidationPassing(data)) {
        isValid = false;
      }
    });
  }

  return isValid;
}



// DOM UTIL FUNCTIONS

var dom = {
  create(type, attrs) {
    var element = document.createElement(type);

    if (!attrs) return element;

    Object.keys(attrs).forEach(function (attr) {
      element[attr] = attrs[attr];
    });

    return element;
  },
  createAndAppendTo(type, parent, attrs) {
    var element = this.create(type, attrs);

    parent.appendChild(element);

    return element;
  }
}

function getUiRefs() {
  return {
    form: document.querySelector('form'),
    list: document.querySelector('.builder ol'),
  };
}

function addStyleLinkNode(href) {
  var head = document.head;
  var styleLink = dom.create('link', {
    type: 'text/css',
    rel: 'stylesheet',
    href: href,
  });


  head.appendChild(styleLink);
}

function setApplicationStyle() {
  addStyleLinkNode('reset.css');
  addStyleLinkNode('styles.css');
}
