"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDoc,
  querySnapshot,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPen,
  faX,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [items, setItems] = useState([]);
  const [filterItems, setFilterItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [editorView, setEditorView] = useState(false);
  const [editItem, setEditItem] = useState({ name: "", quantity: "" });
  const [search, setSearch] = useState("");

  // Add item to database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== "" && newItem.quantity !== "") {
      // setItems([...items, newItem]);
      await addDoc(collection(db, "items"), {
        name: newItem.name.trim(),
        quantity: newItem.quantity,
      });
      setNewItem({ name: "", quantity: "" });
    }
  };

  //Read Items from database
  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);
      setFilterItems(itemsArr);
    });
  }, []);

  //Delete Items from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
  };

  //Toggle Popup Editor
  function togglePop(nam, q, i) {
    setEditorView(!editorView);
    setEditItem({ name: nam, quantity: q, id: i });
  }

  //Updated Search
  const updateSearch = (e) => {
    setSearch(e.target.value);
    const s = e.target.value;

    setFilterItems(
      items.filter((el) => {
        if (s === "") {
          return el;
        } else {
          return el.name.toLowerCase().includes(s.toLowerCase());
        }
      })
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      {editorView ? <Editor toggle={togglePop} editItem={editItem} /> : null}
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl p-4 text-center">Pantry Tracker</h1>
        <div className="bg-slate-800 p-4 rounded-lg">
          <form className="grid grid-cols-6 items-center text-black">
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="col-span-3 p-3 border"
              type="text"
              placeholder="Enter Item"
            />
            <input
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
              className="col-span-2 p-3 border mx-3"
              type="text"
              placeholder="Enter Quantity"
            />
            <button
              onClick={addItem}
              className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"
              type="submit"
            >
              +
            </button>
          </form>
          <form className="grid grid-cols-6 items-center text-black">
            <input
              value={search}
              onChange={updateSearch}
              className="col-span-6 p-3 border mx-1 mt-3"
              type="text"
              placeholder="What are you looking for?"
            />
          </form>
          {/* <List input={search} items={items}></List> */}
          <ul>
            {filterItems.map((item, id) => (
              <li
                key={id}
                className="my-4 w-full flex justify-between bg-slate-950"
              >
                <div className="p-4 w-full flex justify-between">
                  <span className="capitalize">{item.name}</span>
                  <span>{item.quantity}</span>
                </div>
                <button
                  onClick={() => togglePop(item.name, item.quantity, item.id)}
                  className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16"
                >
                  <FontAwesomeIcon
                    icon={faPen}
                    className="fas fa-pen border-slate-300"
                  ></FontAwesomeIcon>
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16"
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="fas fa-check"
                    style={{ color: "red" }}
                  ></FontAwesomeIcon>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

function Editor(props) {
  const [newItem, setNewItem] = useState({
    name: props.editItem.name,
    quantity: props.editItem.quantity,
    id: props.editItem.id,
  });

  const handleEdit = async (e) => {
    e.preventDefault();
    if (newItem.name !== "" && newItem.quantity !== "") {
      //Delete old one
      await deleteDoc(doc(db, "items", newItem.id));

      //Add updated
      await addDoc(collection(db, "items"), {
        name: newItem.name.trim(),
        quantity: newItem.quantity,
      });
      setNewItem({ name: "", quantity: "" });
    }
    props.toggle();
  };

  return (
    <div className="place-self-center absolute z-40 w-full h-full text-center font-mono bg-black bg-opacity-100">
      <div className="max-w-5xl mx-auto bg-slate-800 p-4 rounded-lg">
        <h1 className="text-4xl">EDITOR</h1>
        <form className="grid grid-cols-12 items-center text-black">
          <input
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="col-span-6 p-3 border"
            type="text"
            placeholder={newItem.name}
          />
          <input
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: e.target.value })
            }
            className="col-span-4 p-3 border mx-3"
            type="text"
            placeholder={newItem.quantity}
          />
          <button
            onClick={handleEdit}
            type="submit"
            className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"
          >
            <FontAwesomeIcon
              icon={faCheck}
              className="fas fa-chcek border-slate-300"
              style={{ color: "green" }}
            ></FontAwesomeIcon>
          </button>
          <button
            onClick={props.toggle}
            className="ml-1 text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"
          >
            <FontAwesomeIcon
              icon={faX}
              className="fas fa-x"
              style={{ color: "red" }}
            ></FontAwesomeIcon>
          </button>
        </form>
      </div>
    </div>
  );
}
