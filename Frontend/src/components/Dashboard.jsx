import { Eraser } from "lucide";
import { useEffect, useState } from "react";
function Dashboard() {
  const [finances, setFinances] = useState([]);
  const [sendingReqFinance, setSendingReqFinance] = useState({
    title: "",
    price: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [Loading, setLoading] = useState(false);

  const isDisabled =
    !sendingReqFinance.title.trim() || !sendingReqFinance.price.trim();

  //? Get All finances
  const fetchFinances = async () => {
    try {
      const responce = await fetch("http://localhost:9000/finance");
      const data = await responce.json();
      setFinances(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  //?  POST a new finance item
  const sendFinances = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const responce = await fetch("http://localhost:9000/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendingReqFinance),
      });
      const data = await responce.json();
      // if(finances === data){
      // }
      setFinances([data, ...finances]); //* add new item to UI instantly

      //? reset inputs
      setSendingReqFinance({ title: "", price: "" }); //! this is from Ai

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  //?  DELETE finance item
  const deleteFinances = async (id) => {
    try {
      const responce = await fetch(
        `http://localhost:9000/finance/delete/${id}`,
        {
          method: "DELETE",
          // headers: { "Content-Type": "application/json" },  //!  Ai  removed this.. why!?
        }
      );

      // remove from UI
      //  console.log(data);

      setFinances(finances.filter((f) => f._id !== id)); //! from Ai
      //  const data =  await responce.json();  //!  Ai  removed this.. why!?
    } catch (error) {
      console.error("DELETE error:", error);
    }
  };

  //?  Updating finance item
  const updatingData = async () => {
    e.preventDefault();
    setLoading(true);
    try {
      setLoading(true);
      const responce = await fetch(
        `http://localhost:9000/finance/editingId/${editingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sendingReqFinance),
        }
      );

      const data = await responce.json();
      console.log(data, responce);

      // setFinances((prev)=>{
      //   prev.map((item)=>{ //! this
      //     item._id === editingId ? data : item
      //   } //! and this
      //)
      // })  //! this vertion is wrong becouse of this {} after the ()=> callback function

      setFinances((prev) =>
        prev.map((item) => (item._id === editingId ? data : item))
      );

      setSendingReqFinance({ title: "", price: "" });
      setEditingId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // const handleEdited = (e)=>{
  //   setEditingId(item._id)
  //   sendingReqFinance({
  //   title: "", //! this
  //   price: "", //! and this
  // })
  // }   //! this vertion is wrong becouse of calling the e data or state

  //? handleEdit receives the whole item, not (e)
  const handleEdit = (item) => {
    setEditingId(item._id);

    //? Load the current values into the inputs
    setSendingReqFinance({
      title: item.title,
      price: item.price,
    });}
    const handleChange = (e) => {
      setSendingReqFinance({
        ...sendingReqFinance,
        [e.target.name]: e.target.value,
      });
    };

    //?   Load data on first render
    useEffect(() => {
      fetchFinances();
      setLoading(false);
    }, []);

    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center pt-10 text-gray-200" >
        <h1 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
          <span>💰</span> Finance Dashboard
        </h1>
        <form
          action=""
          onSubmit={sendFinances}
          className="bg-gray-800 p-6 rounded-lg shadow-md w-96 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Expence Items"
            name="title"
            value={sendingReqFinance.title}
            onChange={handleChange}
            className="p-2 rounded-md border border-gray-700 focus:outline-none focus:border-yellow-400 bg-gray-900"
          />
          <input
            type="number"
            placeholder="Amount"
            name="price"
            value={sendingReqFinance.price}
            onChange={handleChange}
            className="p-2 rounded-md border border-gray-700 focus:outline-none focus:border-yellow-400 bg-gray-900"
          />
          <button
            type="submit"
            // className=""
            className={`mt-4 px-4 py-2 rounded 
          ${
            isDisabled
              ? "bg-gray-900 hover:bg-gray-700 text-gray-200 hover:text-gray-900 py-2 rounded-md transition-colors cursor-not-allowed"
              : "bg-gray-700 hover:bg-yellow-400 text-gray-200 hover:text-gray-900 py-2 rounded-md transition-colors"
          }
        `}
            disabled={isDisabled}>
            {Loading ? "Loading...🔃" : "submit"}
          </button>
        </form>
        <h2>Submitted Finances:</h2>
        <table className="mt-10 w-96 text-left border-collapse">
          <thead className="bg-gray-800 rounded-t-md">
            <tr>
              <th className="px-4 py-2 text-yellow-400">Title</th>
              <th className="px-4 py-2 text-yellow-400">Amount</th>
              <th className="px-4 py-2 text-yellow-400">Actions</th>
              <th className="px-4 py-2 text-yellow-400">Update</th>
            </tr>
          </thead>
          <tbody>
            {finances.map((item, idx) => (
              <tr key={idx} className="border-t border-gray-700">
                <td className="px-4 py-2">{item.title}</td>
                <td className="px-4 py-2 text-green-400">${item.price}</td>
                <td className="px-4 py-2 text-red-500 ">
                  <button
                    onClick={() => deleteFinances(item._id)}
                    className="cursor-pointer">
                    🗑️
                  </button>
                </td>
                <td className="px-4 py-2 text-red-500 ">
                  {/* <button
                   onClick={() => updatingData(item._id)}
                 onChange={()=>{handleEdited(item._id)}} 
                 className="cursor-pointer" >
                  ⌛//! this is a wrong vertion
                // </button> */}   
                  <button
                    onClick={() => handleEdit(item)}
                    className="cursor-pointer text-red-500">
                    ⌛
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


export default Dashboard;
