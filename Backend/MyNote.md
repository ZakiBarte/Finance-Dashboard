# 👉 waa maxy code kani... (server.js)-
i just use this...(
    return res.json(existing)
)
  # instead of this 
 return res.json({
        message: "Price updated (added to existing)",
        data: existing
      });

↪️(
    That line is simply the server’s response.
You’re sending back a JSON object to the frontend so your client knows what happened.
)

# the answer will be like the this the json 
{
  "message": "Price updated (added to existing)",
  "data": {
    "_id": "6744ab...something",
    "title": "Food",
    "price": 45
  }
}
