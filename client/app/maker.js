let view = 0;

const handleEntry = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#entryName").val() == '' || $("#entryContent").val() == '') {
        handleError ("All fields are required");
        return false;
    }

    const csrf = $("input[name=_csrf]").val();

    sendAjax('POST', $("#entryForm").attr("action"),$("#entryForm").serialize(), function() {
        loadEntriesFromServer(csrf);
    });

    return false;
};

const handleDelete = (e) => {
    e.preventDefault();
    
    const csrf = $("input[name=_csrf]").val();
    const url = "_id=" + e.target.value + "&_csrf=" + csrf;
    
    sendAjax('DELETE', "/deleteEntry", url, (data) => {
        loadEntriesFromServer(csrf);
    });

    return false;
};

const loadEntryView = (e) => {
    e.preventDefault();
    
    const csrf = $("input[name=_csrf]").val();
    const id = e.target.value;

    sendAjax('GET', '/getEntries', null, (data) => {
        const result = data.entries.find( ({ _id }) => _id === id );
        viewEntry(csrf, id, result.name, result.content, result.date);
    });

    return false;
};

const handleDeleteEntry = (e) => {
    e.preventDefault();
    
    const csrf = $("input[name=_csrf]").val();
    const url = "_id=" + e.target.value + "&_csrf=" + csrf;
    
    sendAjax('DELETE', "/deleteEntry", url, (data) => {
        loadEntriesFromServer(csrf);
    });

    ReactDOM.render(
        <EntryForm csrf={csrf}/>, document.querySelector("#makeEntry")
    );

    return false;
};

const loadEntryEdit = (e) => {
    e.preventDefault();
    
    const csrf = $("input[name=_csrf]").val();
    const id = e.target.value;

    sendAjax('GET', '/getEntries', null, (data) => {
        const result = data.entries.find( ({ _id }) => _id === id );
        viewEdit(csrf, id, result.name, result.content, result.date);
    });

    return false;
};

const handleEditEntry = (e) => {
    e.preventDefault();
    
    const csrf = $("input[name=_csrf]").val();

    sendAjax('PUT', $("#entryEdit").attr("action"), $("#entryEdit").serialize(), function() {
        loadEntriesFromServer(csrf);
    });

    return false;
};

// this will be converted into a rich text editor

const EntryView = () => {
    return (
       <button id="viewButton" onClick={switchViews} >View Entries</button> 
    );

};

const EntryForm = (props) => {
    if (view === 0) {
    return ( 
        <form id="entryForm" 
        name="entryForm"
        onSubmit={handleEntry}
        action="/maker"
        method="POST"
        className="entryForm"
    >
    <label htmlFor="name">Title: </label>
    <input id="entryName" type="text" name="name" placeholder="Entry Title"/>
    <label htmlFor="content"></label>
    <textarea id="entryContent" name="content" placeholder="Write Here"></textarea>
    <input type="hidden" name="_csrf" value={props.csrf}/>
    <input type="hidden" name="date" id="date"/>
    <input className="makEntrySubmit" type="submit" value="Make Entry"/>
      </form>
    );
    }
    else {
        return (
            <div>Entries</div>
        )
    }
};

//for editing entries
//something wierd with these input boxes
const EditForm = (props) => {
    return ( 
        <form id="entryEdit" 
        name="entryEdit"
        onSubmit={handleEditEntry}
        action="/updateEntry"
        method="POST"
        className="entryEdit"
    >
    <button value={props.id} onClick={handleDeleteEntry}>Delete</button>
    <label htmlFor="name">Title: </label>
    <input id="entryName" type="text" name="name" placeholder={props.name}/>
    <label htmlFor="content"></label>
    <textarea id="entryContent" name="content" value={props.content}></textarea>
    <input type="hidden" name="_csrf" value={props.csrf}/>
    <input type="hidden" name="_id" value={props.id} />
    <label htmlFor="content"></label>
    <input  name="date" id="date" value={props.date}/>
    <input className="makEntryEdit" type="submit" value="Edit Entry"/>
      </form>
    );
    
};

//for viewing entries
const ViewForm = (props) => {
   
    return ( 
        <div id="entryView" 
        name="entryView"
        className="entryView"
    >
    <button value={props.id} onClick={loadEntryEdit}>Edit</button>
    <button value={props.id} onClick={handleDeleteEntry}>Delete</button>
    <h1 htmlFor="name">Title: {props.name} </h1>
    <h3  htmlFor="date">Date: {props.date}</h3>
    <p id="entryContent" name="content">{props.content}</p>
    <input type="hidden" name="_csrf" value={props.csrf}/>
      </div>
    );
};

const EntryList = function(props) {
    if(props.entries.length === 0) {
        return (
            <div className="entryList">
                <h3 className="emptyEntry">No Entries yet</h3>
            </div>
        );
    } 

    //generates side bar 
    if (view === 0) {

        const entryNodes = props.entries.map(function(entry) {
            return (
                <div key={entry._id} value={entry._id} className="entry" onClick={loadEntryView}>
                    <h3 className="entryName">Title: {entry.name} </h3>
                    <h3 className="entryDate"> {entry.date} </h3>
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <img src="/assets/img/Journel-Icon.png" alt="journel icon" className="entryIcon"></img>
                </div>
            );
        });
    
        return (
            <div className="entryList">
                {entryNodes} 
            </div>
        );
    }
    //make journel entry
    else if (view === 1) {
        const entryNodes = props.entries.map(function(entry) {
            return (
                <div key={entry._id} value={entry._id} className="entryV">
                    <img src="/assets/img/Journel-Icon.png" alt="journel icon" className="entryIcon"></img>
                    <h3 className="entryNameV">Title: {entry.name} </h3>
                    <h3 className="entryDateV"> {entry.date} </h3>
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <button class="todoOption" id="editButton" value={entry._id} onClick={loadEntryView} >View</button>
                   
                </div>
            );
        });
    
        return (
            <div className="entryListV">
                {entryNodes} 
            </div>
        );
    }
    //view journel entry
    else {

        const entryNodes = props.entries.map(function(entry) {
            return (
                <div key={entry._id} value={entry._id} className="entry" onClick={loadEntryView}>
                    <h3 className="entryName">Title: {entry.name} </h3>
                    <h3 className="entryDate"> {entry.date} </h3>
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <img src="/assets/img/Journel-Icon.png" alt="journel icon" className="entryIcon"></img>
                </div>
            );
        });
    
        return (
            <div className="entryList">
                {entryNodes} 
            </div>
        );

    }
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

const switchViews = (e) => {
    e.preventDefault();

        //switches views 
        let entries = document.querySelector("#entries");

        if (view === 0) {
            view = 1;

            const csrf = $("input[name=_csrf]").val();

            document.querySelector("#viewButton").innerText = "Make Entry";

            entries.style.width = "100%";
            entries.style.float = "none";

            loadEntriesFromServer(csrf);

            ReactDOM.render(
                <EntryForm csrf={csrf}/>, document.querySelector("#makeEntry")
            );
        }
        else {
            view = 0;

            const csrf = $("input[name=_csrf]").val();

            document.querySelector("#viewButton").innerText = "View Entries";

            entries.style.width = "40%";
            entries.style.float = "right";

            loadEntriesFromServer(csrf);

          

            ReactDOM.render(
                <EntryForm csrf={csrf}/>, document.querySelector("#makeEntry")
            );
        }

        return false;
}

const viewEntry = (csrf, id, name, content, date) => {
    ReactDOM.render(
        <ViewForm csrf={csrf} id={id} name={name} content={content} date={date}/>, document.querySelector("#makeEntry")
    );
}

const viewEdit = (csrf, id, name, content, date) => {
    ReactDOM.render(
        <EditForm csrf={csrf} id={id} name={name} content={content} date={date}/>, document.querySelector("#makeEntry")
    );
}

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

};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});