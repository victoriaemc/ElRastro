// EN LA CARPETA PAGES IRAN LAS PAGINAS DE NUESTRA APP

function LoginPage(){
  return(
  <div class="container login-container mt-4">
    <h2 class="text-center mb-5">Iniciar sesión</h2>
    <form>
      <div class="form-floating mb-3">
        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" required/>
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating mb-5">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password" required/>
        <label for="floatingPassword">Password</label>
      </div>
      <button type="submit" class="btn btn-primary">Iniciar sesión</button>
    </form>
</div>
  )
}

export default LoginPage