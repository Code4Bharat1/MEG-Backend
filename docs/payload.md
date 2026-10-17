# payload example for controllers

```javascript

const token = jwt.sign(
  { id: account._id, AccountType: "member" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
```
