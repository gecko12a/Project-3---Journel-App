"use strict";

var view = 0;

var handleEntry = function handleEntry(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#entryName").val() == '' || $("#entryContent").val() == '') {
    handleError("All fields are required");
    return false;
  }

  var csrf = $("input[name=_csrf]").val();
  sendAjax('POST', $("#entryForm").attr("action"), $("#entryForm").serialize(), function () {
    loadEntriesFromServer(csrf);
  });
  return false;
};

var handleDelete = function handleDelete(e) {
  e.preventDefault();
  var csrf = $("input[name=_csrf]").val();
  var url = "_id=" + e.target.value + "&_csrf=" + csrf;
  sendAjax('DELETE', "/deleteEntry", url, function (data) {
    loadEntriesFromServer(csrf);
  });
  return false;
};

var loadEntryView = function loadEntryView(e) {
  e.preventDefault();
  var csrf = $("input[name=_csrf]").val();
  var id = e.target.value;
  sendAjax('GET', '/getEntries', null, function (data) {
    var result = data.entries.find(function (_ref) {
      var _id = _ref._id;
      return _id === id;
    });
    viewEntry(csrf, id, result.name, result.content, result.date);
  });
  return false;
};

var handleDeleteEntry = function handleDeleteEntry(e) {
  e.preventDefault();
  var csrf = $("input[name=_csrf]").val();
  var url = "_id=" + e.target.value + "&_csrf=" + csrf;
  sendAjax('DELETE', "/deleteEntry", url, function (data) {
    loadEntriesFromServer(csrf);
  });
  ReactDOM.render( /*#__PURE__*/React.createElement(EntryForm, {
    csrf: csrf
  }), document.querySelector("#makeEntry"));
  return false;
};

var loadEntryEdit = function loadEntryEdit(e) {
  e.preventDefault();
  var csrf = $("input[name=_csrf]").val();
  var id = e.target.value;
  sendAjax('GET', '/getEntries', null, function (data) {
    var result = data.entries.find(function (_ref2) {
      var _id = _ref2._id;
      return _id === id;
    });
    viewEdit(csrf, id, result.name, result.content, result.date);
  });
  return false;
};

var handleEditEntry = function handleEditEntry(e) {
  e.preventDefault();
  var csrf = $("input[name=_csrf]").val();
  sendAjax('PUT', $("#entryEdit").attr("action"), $("#entryEdit").serialize(), function () {
    loadEntriesFromServer(csrf);
  });
  return false;
}; // this will be converted into a rich text editor


var EntryView = function EntryView() {
  return /*#__PURE__*/React.createElement("button", {
    id: "viewButton",
    onClick: switchViews
  }, "View Entries");
};

var EntryForm = function EntryForm(props) {
  if (view === 0) {
    return /*#__PURE__*/React.createElement("form", {
      id: "entryForm",
      name: "entryForm",
      onSubmit: handleEntry,
      action: "/maker",
      method: "POST",
      className: "entryForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Title: "), /*#__PURE__*/React.createElement("input", {
      id: "entryName",
      type: "text",
      name: "name",
      placeholder: "Entry Title"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "content"
    }), /*#__PURE__*/React.createElement("textarea", {
      id: "entryContent",
      name: "content",
      placeholder: "Write Here"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "date",
      id: "date"
    }), /*#__PURE__*/React.createElement("input", {
      className: "makEntrySubmit",
      type: "submit",
      value: "Make Entry"
    }));
  } else {
    return /*#__PURE__*/React.createElement("div", null, "Entries");
  }
}; //for editing entries
//something wierd with these input boxes


var EditForm = function EditForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "entryEdit",
    name: "entryEdit",
    onSubmit: handleEditEntry,
    action: "/updateEntry",
    method: "POST",
    className: "entryEdit"
  }, /*#__PURE__*/React.createElement("button", {
    value: props.id,
    onClick: handleDeleteEntry
  }, "Delete"), /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Title: "), /*#__PURE__*/React.createElement("input", {
    id: "entryName",
    type: "text",
    name: "name",
    placeholder: props.name
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "content"
  }), /*#__PURE__*/React.createElement("textarea", {
    id: "entryContent",
    name: "content",
    value: props.content
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_id",
    value: props.id
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "content"
  }), /*#__PURE__*/React.createElement("input", {
    name: "date",
    id: "date",
    value: props.date
  }), /*#__PURE__*/React.createElement("input", {
    className: "makEntryEdit",
    type: "submit",
    value: "Edit Entry"
  }));
}; //for viewing entries


var ViewForm = function ViewForm(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "entryView",
    name: "entryView",
    className: "entryView"
  }, /*#__PURE__*/React.createElement("button", {
    value: props.id,
    onClick: loadEntryEdit
  }, "Edit"), /*#__PURE__*/React.createElement("button", {
    value: props.id,
    onClick: handleDeleteEntry
  }, "Delete"), /*#__PURE__*/React.createElement("h1", {
    htmlFor: "name"
  }, "Title: ", props.name, " "), /*#__PURE__*/React.createElement("h3", {
    htmlFor: "date"
  }, "Date: ", props.date), /*#__PURE__*/React.createElement("p", {
    id: "entryContent",
    name: "content"
  }, props.content), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }));
};

var EntryList = function EntryList(props) {
  if (props.entries.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "entryList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyEntry"
    }, "No Entries yet"));
  } //generates side bar 


  if (view === 0) {
    var entryNodes = props.entries.map(function (entry) {
      return /*#__PURE__*/React.createElement("div", {
        key: entry._id,
        value: entry._id,
        className: "entry",
        onClick: loadEntryView
      }, /*#__PURE__*/React.createElement("h3", {
        className: "entryName"
      }, "Title: ", entry.name, " "), /*#__PURE__*/React.createElement("h3", {
        className: "entryDate"
      }, " ", entry.date, " "), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: props.csrf
      }), /*#__PURE__*/React.createElement("img", {
        src: "/assets/img/Journel-Icon.png",
        alt: "journel icon",
        className: "entryIcon"
      }));
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "entryList"
    }, entryNodes);
  } //make journel entry
  else if (view === 1) {
      var _entryNodes = props.entries.map(function (entry) {
        return /*#__PURE__*/React.createElement("div", {
          key: entry._id,
          value: entry._id,
          className: "entryV"
        }, /*#__PURE__*/React.createElement("img", {
          src: "/assets/img/Journel-Icon.png",
          alt: "journel icon",
          className: "entryIcon"
        }), /*#__PURE__*/React.createElement("h3", {
          className: "entryNameV"
        }, "Title: ", entry.name, " "), /*#__PURE__*/React.createElement("h3", {
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
      }, _entryNodes);
    } //view journel entry
    else {
        var _entryNodes2 = props.entries.map(function (entry) {
          return /*#__PURE__*/React.createElement("div", {
            key: entry._id,
            value: entry._id,
            className: "entry",
            onClick: loadEntryView
          }, /*#__PURE__*/React.createElement("h3", {
            className: "entryName"
          }, "Title: ", entry.name, " "), /*#__PURE__*/React.createElement("h3", {
            className: "entryDate"
          }, " ", entry.date, " "), /*#__PURE__*/React.createElement("input", {
            type: "hidden",
            name: "_csrf",
            value: props.csrf
          }), /*#__PURE__*/React.createElement("img", {
            src: "/assets/img/Journel-Icon.png",
            alt: "journel icon",
            className: "entryIcon"
          }));
        });

        return /*#__PURE__*/React.createElement("div", {
          className: "entryList"
        }, _entryNodes2);
      }
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
};

var switchViews = function switchViews(e) {
  e.preventDefault(); //switches views 

  var entries = document.querySelector("#entries");

  if (view === 0) {
    view = 1;
    var csrf = $("input[name=_csrf]").val();
    document.querySelector("#viewButton").innerText = "Make Entry";
    entries.style.width = "100%";
    entries.style["float"] = "none";
    loadEntriesFromServer(csrf);
    ReactDOM.render( /*#__PURE__*/React.createElement(EntryForm, {
      csrf: csrf
    }), document.querySelector("#makeEntry"));
  } else {
    view = 0;

    var _csrf = $("input[name=_csrf]").val();

    document.querySelector("#viewButton").innerText = "View Entries";
    entries.style.width = "40%";
    entries.style["float"] = "right";
    loadEntriesFromServer(_csrf);
    ReactDOM.render( /*#__PURE__*/React.createElement(EntryForm, {
      csrf: _csrf
    }), document.querySelector("#makeEntry"));
  }

  return false;
};

var viewEntry = function viewEntry(csrf, id, name, content, date) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ViewForm, {
    csrf: csrf,
    id: id,
    name: name,
    content: content,
    date: date
  }), document.querySelector("#makeEntry"));
};

var viewEdit = function viewEdit(csrf, id, name, content, date) {
  ReactDOM.render( /*#__PURE__*/React.createElement(EditForm, {
    csrf: csrf,
    id: id,
    name: name,
    content: content,
    date: date
  }), document.querySelector("#makeEntry"));
};

var loadEntriesFromServer = function loadEntriesFromServer(csrf) {
  sendAjax('GET', '/getEntries', null, function (data) {
    var props = {
      entries: data.entries,
      csrf: csrf
    };
    ReactDOM.render( /*#__PURE__*/React.createElement(EntryList, props), document.querySelector("#entries")); // all code to execute after list is gotten

    getDate();
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
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({
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
