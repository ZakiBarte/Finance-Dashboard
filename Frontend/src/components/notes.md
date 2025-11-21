
I’ll give you the **correct backend**, then a **fully corrected frontend**, then a **fixed HTML component**.

Let’s go.

---

# ✅ **1. BACKEND — your backend is correct except for one missing response in catch**

Here is the fixed version:

```js
app.put("/finance/editingId/:id", async (req, res) => {
  try {
    const { id } = req.params;           // correct
    const data = req.body;               // correct

    const editedID = await Finance.findByIdAndUpdate(id, data, { new: true }); 
    // correct

    console.log(editedID);

    res.json(editedID);                  // correct
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Update failed" });   // ❗ You forgot this
  }
});
```

Backend fixed.

---

# ❌ Your frontend has MAJOR mistakes:

### I’ll list them quickly before fixing:

1. `updatingData` doesn’t receive `(e)`
2. You used `${editedID}` but the variable is `editingId`
3. You used `responce` but read from `res`
4. You used `res.json()` but the variable is `response`
5. Your `setFinances` mapping is WRONG → you didn't return anything
6. `handleEdited` is wrong:

   * It does not take the item
   * It calls `sendingReqFinance()` which is wrong
7. You used `onChange` on a button → wrong event
8. Inside `handleEdited`, you wiped the title/price instead of setting them
9. Your update button is calling update function incorrectly

---

# ✅ **2. CLEAN + FIXED FRONTEND**

Here is the **corrected version** with comments so you understand exactly what was wrong:

```jsx
const [editingId, setEditingId] = useState(null);
const [loading, setLoading] = useState(false);

// ❌ You forgot (e)
const updatingData = async (e) => {
  e.preventDefault();       // good, but must receive (e)
  setLoading(true);

  try {
    const response = await fetch(
      `http://localhost:9000/finance/editingId/${editingId}`, 
      // ❌ You wrote ${editedID} — WRONG VARIABLE
      {
        method: "PUT",      // correct
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendingReqFinance),  // correct
      }
    );

    const data = await response.json();  
    // ❌ You wrote res.json() while variable was response

    console.log("Updated:", data);

    // FIX STATE UPDATE (YOU WROTE INVALID MAP)
    setFinances((prev) =>
      prev.map((item) =>
        item._id === editingId ? data : item
      )
    );

    setSendingReqFinance({ title: "", price: "" });
    setEditingId(null);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

---

# ✅ **3. FIXED handleEdit function**

Your function was completely incorrect.

Here is the correct one:

```jsx
// ❗ handleEdit receives the whole item, not (e)
const handleEdit = (item) => {
  setEditingId(item._id);

  // Load the current values into the inputs
  setSendingReqFinance({
    title: item.title,
    price: item.price,
  });
};
```

---

# ❌ **4. This HTML was completely wrong**

Your button:

```jsx
<button
  onChange={()=>{handleEdited(item._id)}}   ❌ WRONG EVENT  
  className="cursor-pointer"
>
  ⌛
</button>
```

## FIX IT

You must use **onClick**, NOT onChange.
And pass the *item* not just its ID.

```jsx
<button
  onClick={() => handleEdit(item)}
  className="cursor-pointer text-red-500"
>
  ⌛
</button>
```

---

# 🔥 Final **FULL FIXED VERSION** (backend + frontend + component)

### Backend — correct now

✔ done

### Frontend — correct version

```jsx
const updatingData = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await fetch(
      `http://localhost:9000/finance/editingId/${editingId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendingReqFinance),
      }
    );

    const data = await response.json();

    setFinances((prev) =>
      prev.map((item) =>
        item._id === editingId ? data : item
      )
    );

    setSendingReqFinance({ title: "", price: "" });
    setEditingId(null);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const handleEdit = (item) => {
  setEditingId(item._id);
  setSendingReqFinance({
    title: item.title,
    price: item.price,
  });
};
```

### HTML — correct version

```jsx
<td className="px-4 py-2 text-red-500">
  <button
    onClick={() => handleEdit(item)}   
    className="cursor-pointer"
  >
    ⌛
  </button>
</td>
```

---


# if you understand the above lines you can mike it full component
**FULL final component**:

* Add mode
* Edit mode
* Update mode
* Disabled button logic
* Tailwind UI
* Loading states


