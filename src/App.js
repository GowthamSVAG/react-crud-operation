import { useEffect, useState } from "react";
import "./App.css";
import { Button, EditableText, InputGroup } from "@blueprintjs/core";
import { ToastContainer, toast, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const notify = () => toast("New User Data Added Successsfully!");
  const notifyUpdate=()=>toast("New Value is Updated!!")
  const notifyDelete=()=>toast("The User Detail is Deleted!!")

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => setUsers(json));
  }, []);

  function addUser() {
    const name = newName.trim();
    const email = newEmail.trim();
    const website = newWebsite.trim();

    if (name && email && website) {
      fetch("https://jsonplaceholder.typicode.com/users", 
        {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          website,
        }),
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          notify();
          setUsers([...users, data]);

        });
        setNewEmail("");
        setNewName("");
        setNewWebsite("");

    }
  }
  function dataUpdate(id,key,value){
    setUsers((users)=>{
        return users.map((user)=>{
          return user.id==id?{...user,[key]:value}:user;
          
        })

    })
    
  }
  function updateButton(id){
      const user=users.find((user)=>users.id==id);
      fetch(`https://jsonplaceholder.typicode.com/users/${id}`, 
        {
        method:"PUT",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((response) => response.json())
        notifyUpdate();    
             
  }
  function deleteButton(id){
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, 
      {
      method:"DELETE",
     
    })
      .then((response) => response.json())
      .then((data)=>{
        setUsers((user)=>{
          return user.filter(user=>user.id!=id)
        })
      })
      notifyDelete();   
    
  }
  
  return (
    <div className="App">
      <table className="bp4-html-table modifier">
        <thead>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Website</th>
          <th>Action</th>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                <EditableText value={user.name} onChange={value=>dataUpdate(user.id,'name',value)}/>
              </td>
              <td>
                <EditableText value={user.email} onChange={value=>dataUpdate(user.id,'email',value)} />
              </td>
              <td>
                <EditableText value={user.website} onChange={value=>dataUpdate(user.id,'website',value)} />
              </td>
              <td>
                <Button intent="Primary" onClick={(e) => updateButton(user.id)}>Update</Button>
                &nbsp;
                <Button intent="Danger" onClick={(e)=>deleteButton(user.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter Your Name"
                />
            </td>
            <td>
              <InputGroup
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter Your Email"
              />
            </td>
            <td>
              <InputGroup
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                placeholder="Enter Your Website"
                />
            </td>
            <td>
              <Button intent="success" placeholder="Add User" onClick={addUser}>
                Add User
              </Button>
              <ToastContainer/>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
