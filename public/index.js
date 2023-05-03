 
  function ChangePassword(e)
  { 
      e.preventDefault();
      let ps1 = e.target.password1.value
      let ps2 = e.target.password2.value
      if(ps1!==ps2)
        alert("password mismatch")
      else
      axios.post("http://localhost:3000/password/changePassword",{password:ps1})
      .then(res=>{
        console.log(res);
      })
      .catch(err=>console.log(err));
  }