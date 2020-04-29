let view = 0;
let listView = 0;
let editorQuill;

//toolbar for quill rte
let toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      
    [{ 'indent': '-1'}, { 'indent': '+1' }],          
    [{ 'direction': 'rtl' }],                         
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],         
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         
  ];
  


//resposible for creating the entries
const handleEntry = (e) => {
    e.preventDefault();

    $("#message").animate({width:'hide'},350);

    //
    if($("#entryName").val() == '' ||  editorQuill.root.innerHTML == "<p><br></p>") {
        handleError ("All fields are required");
        return false;
    }

    //stores html elements from quill editor
    document.querySelector("#contentQ").value = editorQuill.root.innerHTML;

    console.log (editorQuill.root.innerHTML);

    const csrf = $("input[name=_csrf]").val();

    sendAjax('POST', $("#entryForm").attr("action"),$("#entryForm").serialize(), function() {

        loadEntriesFromServer(csrf);
    });

    editorQuill.deleteText(0, 100000);
    document.querySelector("#entryName").value = null;

    return false;
};


//handles deletion of entry from database
const handleDeleteEntry = (e) => {
    e.preventDefault();

    $("#message").animate({width:'hide'},350);
    
    const csrf = $("input[name=_csrf]").val();
    const url = "_id=" + e.target.value + "&_csrf=" + csrf;
    
    sendAjax('DELETE', "/deleteEntry", url, (data) => {
        loadEntriesFromServer(csrf);
    });

    //returns user to full entry view

    ReactDOM.render(
        <ViewTop csrf={csrf}/>, document.querySelector("#makeEntry")
    );

    
    ReactDOM.render(
        <AdBar />, document.querySelector("#ad")
    );

    listView = 1;
    
    let make = document.querySelector("#makeEntry");
    let ad = document.querySelector("#ad");
    let mainC = document.querySelector("#mainContent");
    let entries = document.querySelector("#entries");
    
    entries.style.width = "98%";
    entries.style.float = "none";
    make.style.width = "98%";
    ad.style.visibility = "hidden";
    mainC.style.display= "inline";

    return false;
};


const handleEditEntry = (e) => {
    e.preventDefault();



    if($("#entryName").val() == '' ||  editorQuill.root.innerHTML == "<p><br></p>") {
        handleError ("All fields are required");
        return false;
    }
    
    $("#message").animate({width:'hide'},350);

    const csrf = $("input[name=_csrf]").val();

    document.querySelector("#contentQ").value = editorQuill.root.innerHTML;

    view = 1;
    listView = 1;

    sendAjax('PUT', $("#entryEdit").attr("action"), $("#entryEdit").serialize(), function() {
      
        loadEntriesFromServer(csrf);      
    });

         //returns user to full entry view
    ReactDOM.render(
        <ViewTop csrf={csrf}/>, document.querySelector("#makeEntry")
    );

        
    ReactDOM.render(
        <AdBar />, document.querySelector("#ad")
    );

    let make = document.querySelector("#makeEntry");
    let ad = document.querySelector("#ad");
    let mainC = document.querySelector("#mainContent");
    let entries = document.querySelector("#entries");
    
    entries.style.width = "98%";
    entries.style.float = "none";
    make.style.width = "98%";
    ad.style.visibility = "hidden";
    mainC.style.display= "inline";

    return false;
};

// handle pass change
const handleChangePass = (e) => {
    e.preventDefault();

  $("#message").animate({width:'hide'},350);
  
    if ($('#oldPass').val() == '' || $('#newPass').val() == '' || $('#newPass2').val() == '') {
      handleError('All fields required');
      return false;
    }
  
    if ($('#newPass').val() !== $('#newPass2').val()) {
      handleError('Passwords do not match');
      return false;
    }

    sendAjax('POST',$('#changePassword').attr('action'), $('#changePassword').serialize(), (data) => {

    });

    ReactDOM.render(
        <PassEmpty />, document.querySelector("#passBlock")
    );
  
    return false;
  };

  const closePass = () =>
  {
    ReactDOM.render(
        <PassEmpty />, document.querySelector("#passBlock")
    ); 
  }

//loads view of individual entry
const loadEntryView = (e) => {
    e.preventDefault();
    
    $("#message").animate({width:'hide'},350);

    const csrf = $("input[name=_csrf]").val();
    const id = e.target.value;

    document.querySelector("#viewButton").innerText = "Make Entry";

    let mainC = document.querySelector("#mainContent");
    let ad = document.querySelector("#ad");
    let make = document.querySelector("#makeEntry");

    entries.style.width = "20%";
    entries.style.float = "right";
    mainC.style.display= "flex";
    ad.style.visibility = "visible";
    make.style.width = "65%";

    listView = 0;
    view = 1;

    sendAjax('GET', '/getEntries', null, (data) => {
        const result = data.entries.find( ({ _id }) => _id === id );
        viewEntry(csrf, id, result.name, result.content, result.date);
        document.querySelector("#editor").innerHTML = result.content;
        loadEntriesFromServer(csrf);

        editorQuill = new Quill('#editor', {
            readOnly: true,
            toolbar: false

          });

          ReactDOM.render(
            <AdBar />, document.querySelector("#ad")
        );
    });


    return false;
};

//loads entry editor
const loadEntryEdit = (e) => {
    e.preventDefault();

    $("#message").animate({width:'hide'},350);

    const csrf = $("input[name=_csrf]").val();
    const id = e.target.value;

    let ad = document.querySelector("#ad");
    let mainC = document.querySelector("#mainContent");

    entries.style.width = "20%";
    mainC.style.display= "flex";
    ad.style.visibility = "visible";

    listView = 0;

    sendAjax('GET', '/getEntries', null, (data) => {
        const result = data.entries.find( ({ _id }) => _id === id );
        viewEdit(csrf, id, result.name, result.content, result.date);
        document.querySelector("#editor").innerHTML = result.content;
        loadEntriesFromServer(csrf);
        loadQuill();
    });

    return false;
};

//loads nav bar elements
const EntryView = () => {
    return (
        <div>
        <button id="viewButton" onClick={switchViews} >View Entries</button> 
       <button id="passB" onClick={setupPassChangeForm} >Change Password</button> 
        </div>
       
    );

};

const PassEmpty = () => {
    return (
        <div></div>
       
    );

};

//form to create new entries
const EntryForm = (props) => {
    return ( 

    <form id="entryForm" 
        name="entryForm"
        onSubmit={handleEntry}
        action="/maker"
        method="POST"
        className="entryForm"
    >
        <div id="nameTitle">
        <label  id="nameLabel" htmlFor="name">Title: </label>
        <input id="entryName" type="text" name="name" placeholder="Entry Title"/>
        </div>
      
    <div id="whiteSpace">
    <div name="content" id="editor" >
        <p placeholder="Write Here!"></p>
    </div>    
    </div> 
    <input type="hidden" name="content" id="contentQ"/>
    <input type="hidden" name="_csrf" value={props.csrf}/>
    <input type="hidden" name="date" id="date"/>
    <input id="submitButton" className="makEntrySubmit" type="submit" value="Make Entry"/>
    </form>
        
    );
};

//loads add bar with logic to hide it
const AdBar = () => {

    let ad = document.querySelector("#ad");
    
    if (listView === 0)
    {   
        ad.style.margin = "1% 0px 0px 1%";
        return (    
            <img id="adPic" src="/assets/img/Ad.png"/> 
            );
    }
    else {
        ad.style.margin = "0% 0px 0px 0%";
        return <div></div>;
    }
    

};
//loads head for viewing element
const ViewTop = () => {
    return(
        <div id= "viewTitle" >Entries </div>
    );
};

//takes user back from edit or view page to full view of entries
const backToView = () => {

    const csrf = $("input[name=_csrf]").val();

    view = 1;
    listView = 1;
    
    ReactDOM.render(
        <ViewTop csrf={csrf}/>, document.querySelector("#makeEntry")
    );

        
    ReactDOM.render(
        <AdBar />, document.querySelector("#ad")
)   ;

    loadEntriesFromServer(csrf);

    let make = document.querySelector("#makeEntry");
    let ad = document.querySelector("#ad");
    let mainC = document.querySelector("#mainContent");
    let entries = document.querySelector("#entries");
    
    entries.style.width = "98%";
    entries.style.float = "none";
    make.style.width = "98%";
    ad.style.visibility = "hidden";
    mainC.style.display= "inline";
}

//for editing entries
const EditForm = (props) => {
    return ( 
        <form id="entryEdit" 
        name="entryEdit"
        onSubmit={handleEditEntry}
        action="/updateEntry"
        method="POST"
        className="entryEdit"
    >
  

    <div id="nameTitle">
        <label  id="nameLabel" htmlFor="name">Title: </label>
        <input id="entryName" type="text" name="name" defaultValue={props.name}/>
        <label id="editDate">{props.date}</label>
    <button id="deleteEdit" value={props.id} onClick={handleDeleteEntry}>Delete</button>
    </div>
    <div id="whiteSpace">
    <div name="content" id="editor" >
        <p></p>
    </div>    
    </div>   
    
    <input type="hidden" name="content" id="contentQ"/>
    <input type="hidden" name="_csrf" value={props.csrf}/>
    <input type="hidden" name="_id" value={props.id} />
    <input type="hidden"  name="date" id="date" value={props.date}/>
    <button id="backEdit" value={props.id} onClick={backToView}>View Entries</button>
    <input className="makEntryEdit" type="submit" value="Edit Entry"/>
      </form>
    );
    
};

//for viewing one entry
const ViewForm = (props) => {
   
    return ( 
        <div id="entryView" 
        name="entryView"
        className="entryView"
    >
    <h1 id="viewName" htmlFor="name">{props.name} </h1>
    <h3  id="viewDate" htmlFor="date">Date: {props.date}</h3>
   
    <div name="content" id="editor">
        </div>
    <input type="hidden" name="_csrf" value={props.csrf}/>
    <button id="backEditV" value={props.id} onClick={backToView}>View Entries</button>
    <button id="editView" value={props.id} onClick={loadEntryEdit}>Edit</button>
    <button id="deleteView" value={props.id} onClick={handleDeleteEntry}>Delete</button>
      </div>
    );
};

//builds list of entries depending on view
const EntryList = function(props) {
    if(props.entries.length === 0) {
        return (
            <div className="entryList">
                <h3 className="emptyEntry">No Entries yet</h3>
            </div>
        );
    } 

    //generates side bar 
    if (listView === 0) {

        const entryNodes = props.entries.map(function(entry) {
            return (
                <div key={entry._id} value={entry._id} className="entry" >
                    <h3 className="entryName">{entry.name} </h3>
                    <h3 className="entryDate"> {entry.date} </h3>
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <button class="view" id="editButton" value={entry._id} onClick={loadEntryView} >View</button>
                </div>
            );
        });
    
        return (
            <div className="entryList">
                {entryNodes[entryNodes.length-1]}
                {entryNodes[entryNodes.length-2]} 
                {entryNodes[entryNodes.length-3]} 
                {entryNodes[entryNodes.length-4]} 
                {entryNodes[entryNodes.length-5]} 
            </div>
        );
    }
    //make journel entry
    else if (listView === 1) {
        const entryNodes = props.entries.map(function(entry) {
            return (
                <div key={entry._id} value={entry._id} className="entryV">
                    <h3 className="entryNameV"> {entry.name} </h3>
                    <h3 className="entryDateV"> {entry.date} </h3>
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <button class="view" id="editButton" value={entry._id} onClick={loadEntryView} >View</button>
                   
                </div>
            );
        });
    
        return (
            <div className="entryListV">
                {entryNodes.reverse()} 
            </div>
        );
    }
    
    return false;
};

//password form
  const PassForm = (props) => {
    return (
        <div id="passForm">
            <form id="changePassword" 
              name="changePassword" 
              action="/pass" 
              method="POST" 
              class="passForm" 
              onSubmit={handleChangePass}
              >
                <input id="oldPass" type="password" name="oldPass" placeholder="Old Password" />
                <input id="newPass" type="password" name="newPass" placeholder="New Password" />
                <input id="newPass2" type="password" name="newPass2" placeholder="Repeat New Password" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input id="passButton"className="formSubmit" type="submit" value="Change Password" />
            </form>
            <button id="closePass" className="formSubmit" onClick={closePass} >Close</button>
        </div>
     
    )
  };


//render password form
const setupPassChangeForm = () => {

    const csrf = $("input[name=_csrf]").val();

    ReactDOM.render(
        <PassForm csrf={csrf} />, document.querySelector("#passBlock")
    );
};

//sets date of journels
const getDate = () => {
    if(view === 0){
        let n =  new Date();
        let y = n.getFullYear();
        let m = n.getMonth() + 1;
        let d = n.getDate();
        document.getElementById("date").value = m + "/" + d + "/" + y;
    }
   
    return false;
}

//switches main view of page
const switchViews = (e) => {
    e.preventDefault();

    $("#message").animate({width:'hide'},350);

        //switches views 
        let entries = document.querySelector("#entries");
        let mainC = document.querySelector("#mainContent");
        let make = document.querySelector("#makeEntry");
        let ad = document.querySelector("#ad");
        //list of entries view
        if (view === 0) {
            view = 1;
            listView = 1;

            const csrf = $("input[name=_csrf]").val();

            document.querySelector("#viewButton").innerText = "Make Entry";

            entries.style.width = "98%";
            entries.style.float = "none";
            entries.style.margin= "1% 0px 0px 1%";
            mainC.style.display= "inline";
            make.style.width = "98%";
            ad.style.visibility = "hidden";

           
            loadEntriesFromServer(csrf);

            ReactDOM.render(
                <ViewTop csrf={csrf}/>, document.querySelector("#makeEntry")
            );

            ReactDOM.render(
                <AdBar />, document.querySelector("#ad")
            );
            
        }
        else {
            //maker view
            view = 0;
            listView = 0;

            const csrf = $("input[name=_csrf]").val();

            document.querySelector("#viewButton").innerText = "View Entries";

            entries.style.width = "20%";
            entries.style.float = "right";
            mainC.style.display= "flex";
            entries.style.margin= "1% 0px 0px 1%";
            make.style.width = "65%";
            ad.style.visibility = "visible";

            loadEntriesFromServer(csrf);

          

            ReactDOM.render(
                <EntryForm csrf={csrf}/>, document.querySelector("#makeEntry")
            );

            ReactDOM.render(
                <AdBar />, document.querySelector("#ad")
            );
            loadQuill();

        }

        return false;
}

//sets entry viewer
const viewEntry = (csrf, id, name, content, date) => {
    ReactDOM.render(
        <ViewForm csrf={csrf} id={id} name={name} content={content} date={date}/>, document.querySelector("#makeEntry")
    );
}

//loads editor page
const viewEdit = (csrf, id, name, content, date) => {
    ReactDOM.render(
        <EditForm csrf={csrf} id={id} name={name} content={content} date={date}/>, document.querySelector("#makeEntry")
    );


}

//retrieves entreis from server
const loadEntriesFromServer = (csrf) => {
    sendAjax('GET', '/getEntries', null, (data) => {
        const props = {
            entries: data.entries,
            csrf: csrf
        };

        ReactDOM.render(
            <EntryList {...props} />, document.querySelector("#entries")
        );
        // all code to execute after list is gotten

        getDate();

    });
};

//initializes Quill editor
const loadQuill = () => {
    
    editorQuill = new Quill('#editor', {
  modules: {
    toolbar: toolbarOptions
  },
  theme: 'snow'
});
};

const setup = function(csrf) {

    const props = {
        entries: [],
        csrf: csrf
    };

    ReactDOM.render(
        <EntryForm csrf={csrf}/>, document.querySelector("#makeEntry")
    );

    ReactDOM.render(
        <EntryList {...props} />, document.querySelector("#entries")
    );

    ReactDOM.render(
        <EntryView />, document.querySelector("#nav")
    );

    loadEntriesFromServer(csrf);

    loadQuill();

};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});
