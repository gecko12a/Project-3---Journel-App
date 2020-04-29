"use strict";

var view = 0;
var listView = 0;
var editorQuill; //toolbar for quill rte

var toolbarOptions = [['bold', 'italic', 'underline', 'strike'], ['blockquote', 'code-block'], [{
  'header': 1
}, {
  'header': 2
}], [{
  'list': 'ordered'
}, {
  'list': 'bullet'
}], [{
  'script': 'sub'
}, {
  'script': 'super'
}], [{
  'indent': '-1'
}, {
  'indent': '+1'
}], [{
  'direction': 'rtl'
}], [{
  'size': ['small', false, 'large', 'huge']
}], [{
  'header': [1, 2, 3, 4, 5, 6, false]
}], [{
  'color': []
}, {
  'background': []
}], [{
  'font': []
}], [{
  'align': []
}], ['clean']]; //resposible for creating the entries

var handleEntry = function handleEntry(e) {
  e.preventDefault();
  $("#message").animate({
    width: 'hide'
  }, 350); //

  if ($("#entryName").val() == '' || editorQuill.root.innerHTML == "<p><br></p>") {
    handleError("All fields are required");
    return false;
  } //stores html elements from quill editor


  document.querySelector("#contentQ").value = editorQuill.root.innerHTML;
  console.log(editorQuill.root.innerHTML);
  var csrf = $("input[name=_csrf]").val();
  sendAjax('POST', $("#entryForm").attr("action"), $("#entryForm").serialize(), function () {
    loadEntriesFromServer(csrf);
  });
  editorQuill.deleteText(0, 100000);
  document.querySelector("#entryName").value = null;
  return false;
}; //handles deletion of entry from database


var handleDeleteEntry = function handleDeleteEntry(e) {
  e.preventDefault();
  $("#message").animate({
    width: 'hide'
  }, 350);
  var csrf = $("input[name=_csrf]").val();
  var url = "_id=" + e.target.value + "&_csrf=" + csrf;
  sendAjax('DELETE', "/deleteEntry", url, function (data) {
    loadEntriesFromServer(csrf);
  }); //returns user to full entry view

  ReactDOM.render( /*#__PURE__*/React.createElement(ViewTop, {
    csrf: csrf
  }), document.querySelector("#makeEntry"));
  ReactDOM.render( /*#__PURE__*/React.createElement(AdBar, null), document.querySelector("#ad"));
  listView = 1;
  var make = document.querySelector("#makeEntry");
  var ad = document.querySelector("#ad");
  var mainC = document.querySelector("#mainContent");
  var entries = document.querySelector("#entries");
  entries.style.width = "98%";
  entries.style["float"] = "none";
  make.style.width = "98%";
  ad.style.visibility = "hidden";
  mainC.style.display = "inline";
  return false;
};

var handleEditEntry = function handleEditEntry(e) {
  e.preventDefault();

  if ($("#entryName").val() == '' || editorQuill.root.innerHTML == "<p><br></p>") {
    handleError("All fields are required");
    return false;
  }

  $("#message").animate({
    width: 'hide'
  }, 350);
  var csrf = $("input[name=_csrf]").val();
  document.querySelector("#contentQ").value = editorQuill.root.innerHTML;
  view = 1;
  listView = 1;
  sendAjax('PUT', $("#entryEdit").attr("action"), $("#entryEdit").serialize(), function () {
    loadEntriesFromServer(csrf);
  }); //returns user to full entry view

  ReactDOM.render( /*#__PURE__*/React.createElement(ViewTop, {
    csrf: csrf
  }), document.querySelector("#makeEntry"));
  ReactDOM.render( /*#__PURE__*/React.createElement(AdBar, null), document.querySelector("#ad"));
  var make = document.querySelector("#makeEntry");
  var ad = document.querySelector("#ad");
  var mainC = document.querySelector("#mainContent");
  var entries = document.querySelector("#entries");
  entries.style.width = "98%";
  entries.style["float"] = "none";
  make.style.width = "98%";
  ad.style.visibility = "hidden";
  mainC.style.display = "inline";
  return false;
}; // handle pass change


var handleChangePass = function handleChangePass(e) {
  e.preventDefault();
  $("#message").animate({
    width: 'hide'
  }, 350);

  if ($('#oldPass').val() == '' || $('#newPass').val() == '' || $('#newPass2').val() == '') {
    handleError('All fields required');
    return false;
  }

  if ($('#newPass').val() !== $('#newPass2').val()) {
    handleError('Passwords do not match');
    return false;
  }

  sendAjax('POST', $('#changePassword').attr('action'), $('#changePassword').serialize(), function (data) {});
  ReactDOM.render( /*#__PURE__*/React.createElement(PassEmpty, null), document.querySelector("#passBlock"));
  return false;
};

var closePass = function closePass() {
  ReactDOM.render( /*#__PURE__*/React.createElement(PassEmpty, null), document.querySelector("#passBlock"));
}; //loads view of individual entry


var loadEntryView = function loadEntryView(e) {
  e.preventDefault();
  $("#message").animate({
    width: 'hide'
  }, 350);
  var csrf = $("input[name=_csrf]").val();
  var id = e.target.value;
  document.querySelector("#viewButton").innerText = "Make Entry";
  var mainC = document.querySelector("#mainContent");
  var ad = document.querySelector("#ad");
  var make = document.querySelector("#makeEntry");
  entries.style.width = "20%";
  entries.style["float"] = "right";
  mainC.style.display = "flex";
  ad.style.visibility = "visible";
  make.style.width = "65%";
  listView = 0;
  view = 1;
  sendAjax('GET', '/getEntries', null, function (data) {
    var result = data.entries.find(function (_ref) {
      var _id = _ref._id;
      return _id === id;
    });
    viewEntry(csrf, id, result.name, result.content, result.date);
    document.querySelector("#editor").innerHTML = result.content;
    loadEntriesFromServer(csrf);
    editorQuill = new Quill('#editor', {
      readOnly: true,
      toolbar: false
    });
    ReactDOM.render( /*#__PURE__*/React.createElement(AdBar, null), document.querySelector("#ad"));
  });
  return false;
}; //loads entry editor


var loadEntryEdit = function loadEntryEdit(e) {
  e.preventDefault();
  $("#message").animate({
    width: 'hide'
  }, 350);
  var csrf = $("input[name=_csrf]").val();
  var id = e.target.value;
  var ad = document.querySelector("#ad");
  var mainC = document.querySelector("#mainContent");
  entries.style.width = "20%";
  mainC.style.display = "flex";
  ad.style.visibility = "visible";
  listView = 0;
  sendAjax('GET', '/getEntries', null, function (data) {
    var result = data.entries.find(function (_ref2) {
      var _id = _ref2._id;
      return _id === id;
    });
    viewEdit(csrf, id, result.name, result.content, result.date);
    document.querySelector("#editor").innerHTML = result.content;
    loadEntriesFromServer(csrf);
    loadQuill();
  });
  return false;
}; //loads nav bar elements


var EntryView = function EntryView() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    id: "viewButton",
    onClick: switchViews
  }, "View Entries"), /*#__PURE__*/React.createElement("button", {
    id: "passB",
    onClick: setupPassChangeForm
  }, "Change Password"));
};

var PassEmpty = function PassEmpty() {
  return /*#__PURE__*/React.createElement("div", null);
}; //form to create new entries


var EntryForm = function EntryForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "entryForm",
    name: "entryForm",
    onSubmit: handleEntry,
    action: "/maker",
    method: "POST",
    className: "entryForm"
  }, /*#__PURE__*/React.createElement("div", {
    id: "nameTitle"
  }, /*#__PURE__*/React.createElement("label", {
    id: "nameLabel",
    htmlFor: "name"
  }, "Title: "), /*#__PURE__*/React.createElement("input", {
    id: "entryName",
    type: "text",
    name: "name",
    placeholder: "Entry Title"
  })), /*#__PURE__*/React.createElement("div", {
    id: "whiteSpace"
  }, /*#__PURE__*/React.createElement("div", {
    name: "content",
    id: "editor"
  }, /*#__PURE__*/React.createElement("p", {
    placeholder: "Write Here!"
  }))), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "content",
    id: "contentQ"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "date",
    id: "date"
  }), /*#__PURE__*/React.createElement("input", {
    id: "submitButton",
    className: "makEntrySubmit",
    type: "submit",
    value: "Make Entry"
  }));
}; //loads add bar with logic to hide it


var AdBar = function AdBar() {
  var ad = document.querySelector("#ad");

  if (listView === 0) {
    ad.style.margin = "1% 0px 0px 1%";
    return /*#__PURE__*/React.createElement("img", {
      id: "adPic",
      src: "/assets/img/Ad.png"
    });
  } else {
    ad.style.margin = "0% 0px 0px 0%";
    return /*#__PURE__*/React.createElement("div", null);
  }
}; //loads head for viewing element


var ViewTop = function ViewTop() {
  return /*#__PURE__*/React.createElement("div", {
    id: "viewTitle"
  }, "Entries ");
}; //takes user back from edit or view page to full view of entries


var backToView = function backToView() {
  var csrf = $("input[name=_csrf]").val();
  view = 1;
  listView = 1;
  ReactDOM.render( /*#__PURE__*/React.createElement(ViewTop, {
    csrf: csrf
  }), document.querySelector("#makeEntry"));
  ReactDOM.render( /*#__PURE__*/React.createElement(AdBar, null), document.querySelector("#ad"));
  loadEntriesFromServer(csrf);
  var make = document.querySelector("#makeEntry");
  var ad = document.querySelector("#ad");
  var mainC = document.querySelector("#mainContent");
  var entries = document.querySelector("#entries");
  entries.style.width = "98%";
  entries.style["float"] = "none";
  make.style.width = "98%";
  ad.style.visibility = "hidden";
  mainC.style.display = "inline";
}; //for editing entries


var EditForm = function EditForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "entryEdit",
    name: "entryEdit",
    onSubmit: handleEditEntry,
    action: "/updateEntry",
    method: "POST",
    className: "entryEdit"
  }, /*#__PURE__*/React.createElement("div", {
    id: "nameTitle"
  }, /*#__PURE__*/React.createElement("label", {
    id: "nameLabel",
    htmlFor: "name"
  }, "Title: "), /*#__PURE__*/React.createElement("input", {
    id: "entryName",
    type: "text",
    name: "name",
    defaultValue: props.name
  }), /*#__PURE__*/React.createElement("label", {
    id: "editDate"
  }, props.date), /*#__PURE__*/React.createElement("button", {
    id: "deleteEdit",
    value: props.id,
    onClick: handleDeleteEntry
  }, "Delete")), /*#__PURE__*/React.createElement("div", {
    id: "whiteSpace"
  }, /*#__PURE__*/React.createElement("div", {
    name: "content",
    id: "editor"
  }, /*#__PURE__*/React.createElement("p", null))), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "content",
    id: "contentQ"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_id",
    value: props.id
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "date",
    id: "date",
    value: props.date
  }), /*#__PURE__*/React.createElement("button", {
    id: "backEdit",
    value: props.id,
    onClick: backToView
  }, "View Entries"), /*#__PURE__*/React.createElement("input", {
    className: "makEntryEdit",
    type: "submit",
    value: "Edit Entry"
  }));
}; //for viewing one entry


var ViewForm = function ViewForm(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "entryView",
    name: "entryView",
    className: "entryView"
  }, /*#__PURE__*/React.createElement("h1", {
    id: "viewName",
    htmlFor: "name"
  }, props.name, " "), /*#__PURE__*/React.createElement("h3", {
    id: "viewDate",
    htmlFor: "date"
  }, "Date: ", props.date), /*#__PURE__*/React.createElement("div", {
    name: "content",
    id: "editor"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("button", {
    id: "backEditV",
    value: props.id,
    onClick: backToView
  }, "View Entries"), /*#__PURE__*/React.createElement("button", {
    id: "editView",
    value: props.id,
    onClick: loadEntryEdit
  }, "Edit"), /*#__PURE__*/React.createElement("button", {
    id: "deleteView",
    value: props.id,
    onClick: handleDeleteEntry
  }, "Delete"));
}; //builds list of entries depending on view


var EntryList = function EntryList(props) {
  if (props.entries.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "entryList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyEntry"
    }, "No Entries yet"));
  } //generates side bar 


  if (listView === 0) {
    var entryNodes = props.entries.map(function (entry) {
      return /*#__PURE__*/React.createElement("div", {
        key: entry._id,
        value: entry._id,
        className: "entry"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "entryName"
      }, entry.name, " "), /*#__PURE__*/React.createElement("h3", {
        className: "entryDate"
      }, " ", entry.date, " "), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: props.csrf
      }), /*#__PURE__*/React.createElement("button", {
        "class": "view",
        id: "editButton",
        value: entry._id,
        onClick: loadEntryView
      }, "View"));
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "entryList"
    }, entryNodes[entryNodes.length - 1], entryNodes[entryNodes.length - 2], entryNodes[entryNodes.length - 3], entryNodes[entryNodes.length - 4], entryNodes[entryNodes.length - 5]);
  } //make journel entry
  else if (listView === 1) {
      var _entryNodes = props.entries.map(function (entry) {
        return /*#__PURE__*/React.createElement("div", {
          key: entry._id,
          value: entry._id,
          className: "entryV"
        }, /*#__PURE__*/React.createElement("h3", {
          className: "entryNameV"
        }, " ", entry.name, " "), /*#__PURE__*/React.createElement("h3", {
          className: "entryDateV"
        }, " ", entry.date, " "), /*#__PURE__*/React.createElement("input", {
          type: "hidden",
          name: "_csrf",
          value: props.csrf
        }), /*#__PURE__*/React.createElement("button", {
          "class": "view",
          id: "editButton",
          value: entry._id,
          onClick: loadEntryView
        }, "View"));
      });

      return /*#__PURE__*/React.createElement("div", {
        className: "entryListV"
      }, _entryNodes.reverse());
    }

  return false;
}; //password form


var PassForm = function PassForm(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "passForm"
  }, /*#__PURE__*/React.createElement("form", {
    id: "changePassword",
    name: "changePassword",
    action: "/pass",
    method: "POST",
    "class": "passForm",
    onSubmit: handleChangePass
  }, /*#__PURE__*/React.createElement("input", {
    id: "oldPass",
    type: "password",
    name: "oldPass",
    placeholder: "Old Password"
  }), /*#__PURE__*/React.createElement("input", {
    id: "newPass",
    type: "password",
    name: "newPass",
    placeholder: "New Password"
  }), /*#__PURE__*/React.createElement("input", {
    id: "newPass2",
    type: "password",
    name: "newPass2",
    placeholder: "Repeat New Password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    id: "passButton",
    className: "formSubmit",
    type: "submit",
    value: "Change Password"
  })), /*#__PURE__*/React.createElement("button", {
    id: "closePass",
    className: "formSubmit",
    onClick: closePass
  }, "Close"));
}; //render password form


var setupPassChangeForm = function setupPassChangeForm() {
  var csrf = $("input[name=_csrf]").val();
  ReactDOM.render( /*#__PURE__*/React.createElement(PassForm, {
    csrf: csrf
  }), document.querySelector("#passBlock"));
}; //sets date of journels


var getDate = function getDate() {
  if (view === 0) {
    var n = new Date();
    var y = n.getFullYear();
    var m = n.getMonth() + 1;
    var d = n.getDate();
    document.getElementById("date").value = m + "/" + d + "/" + y;
  }

  return false;
}; //switches main view of page


var switchViews = function switchViews(e) {
  e.preventDefault();
  $("#message").animate({
    width: 'hide'
  }, 350); //switches views 

  var entries = document.querySelector("#entries");
  var mainC = document.querySelector("#mainContent");
  var make = document.querySelector("#makeEntry");
  var ad = document.querySelector("#ad"); //list of entries view

  if (view === 0) {
    view = 1;
    listView = 1;
    var csrf = $("input[name=_csrf]").val();
    document.querySelector("#viewButton").innerText = "Make Entry";
    entries.style.width = "98%";
    entries.style["float"] = "none";
    entries.style.margin = "1% 0px 0px 1%";
    mainC.style.display = "inline";
    make.style.width = "98%";
    ad.style.visibility = "hidden";
    loadEntriesFromServer(csrf);
    ReactDOM.render( /*#__PURE__*/React.createElement(ViewTop, {
      csrf: csrf
    }), document.querySelector("#makeEntry"));
    ReactDOM.render( /*#__PURE__*/React.createElement(AdBar, null), document.querySelector("#ad"));
  } else {
    //maker view
    view = 0;
    listView = 0;

    var _csrf = $("input[name=_csrf]").val();

    document.querySelector("#viewButton").innerText = "View Entries";
    entries.style.width = "20%";
    entries.style["float"] = "right";
    mainC.style.display = "flex";
    entries.style.margin = "1% 0px 0px 1%";
    make.style.width = "65%";
    ad.style.visibility = "visible";
    loadEntriesFromServer(_csrf);
    ReactDOM.render( /*#__PURE__*/React.createElement(EntryForm, {
      csrf: _csrf
    }), document.querySelector("#makeEntry"));
    ReactDOM.render( /*#__PURE__*/React.createElement(AdBar, null), document.querySelector("#ad"));
    loadQuill();
  }

  return false;
}; //sets entry viewer


var viewEntry = function viewEntry(csrf, id, name, content, date) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ViewForm, {
    csrf: csrf,
    id: id,
    name: name,
    content: content,
    date: date
  }), document.querySelector("#makeEntry"));
}; //loads editor page


var viewEdit = function viewEdit(csrf, id, name, content, date) {
  ReactDOM.render( /*#__PURE__*/React.createElement(EditForm, {
    csrf: csrf,
    id: id,
    name: name,
    content: content,
    date: date
  }), document.querySelector("#makeEntry"));
}; //retrieves entreis from server


var loadEntriesFromServer = function loadEntriesFromServer(csrf) {
  sendAjax('GET', '/getEntries', null, function (data) {
    var props = {
      entries: data.entries,
      csrf: csrf
    };
    ReactDOM.render( /*#__PURE__*/React.createElement(EntryList, props), document.querySelector("#entries")); // all code to execute after list is gotten

    getDate();
  });
}; //initializes Quill editor


var loadQuill = function loadQuill() {
  editorQuill = new Quill('#editor', {
    modules: {
      toolbar: toolbarOptions
    },
    theme: 'snow'
  });
};

var setup = function setup(csrf) {
  var props = {
    entries: [],
    csrf: csrf
  };
  ReactDOM.render( /*#__PURE__*/React.createElement(EntryForm, {
    csrf: csrf
  }), document.querySelector("#makeEntry"));
  ReactDOM.render( /*#__PURE__*/React.createElement(EntryList, props), document.querySelector("#entries"));
  ReactDOM.render( /*#__PURE__*/React.createElement(EntryView, null), document.querySelector("#nav"));
  loadEntriesFromServer(csrf);
  loadQuill();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#message").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#message").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
