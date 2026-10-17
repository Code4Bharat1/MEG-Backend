# payload example for controllers

```javascript

const accessToken = jwt.sign(
  { id: account._id, AccountType: "member" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

const refreshToken = jwt.sign(
  { id: account._id, AccountType: "member" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
```


# controllers

## Admin
### /login
### /register

## Member
### /login
### /register

## Visitor
### /login
### /register

# middlewares
### /verify - To verify the authenticity of the person

# models

### 
