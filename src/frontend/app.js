const $submit = document.getElementById('submit');
 $password = document.getElementById('password');
 $username = document.getElementById('username');
 $visible = document.getElementById('visible');

 document.addEventListener("change", (e) =>{
    if(e.target === $visible){
        if($visible.checked === false) $password.type = "password";
        else $password.type = "text";
        
    }
 });

 document.addEventListener("click", (e) =>{
    if(e.target === $submit){
        if($password.value !== "" && $username.value === ""){
            e.preventDefault();
            windoww.location.href = "index.html";
        }}});
        document.addEventListener("DOMContentLoaded", () => {
            // Lógica de inicio de sesión para login.html
            if (window.location.pathname.endsWith("login.html")) {
                $submit.addEventListener("click", (e) => {
                    e.preventDefault();
                    const username = $username.value.trim();
                    const password = $password.value.trim();
                    // Validación simple (puedes mejorarla con backend)
                    if (username !== "" && password !== "") {
                        // Simula inicio de sesión exitoso
                        localStorage.setItem("loggedIn", "true");
                        window.location.href = "index.html";
                    } else {
                        alert("Por favor, ingresa usuario y contraseña.");
                    }
                });
            }

            // Lógica de botones interactivos para index.html
            if (window.location.pathname.endsWith("index.html")) {
                // Verifica si el usuario está logueado
                if (localStorage.getItem("loggedIn") !== "true") {
                    window.location.href = "login.html";
                    return;
                }

                // Ejemplo de lógica para botones interactivos
                const btnLogout = document.getElementById("logout");
                if (btnLogout) {
                    btnLogout.addEventListener("click", () => {
                        localStorage.removeItem("loggedIn");
                        window.location.href = "login.html";
                    });
                }

                // Otros botones interactivos
                const btns = document.querySelectorAll(".interactive-btn");
                btns.forEach(btn => {
                    btn.addEventListener("click", () => {
                        alert(`Botón ${btn.id} presionado`);
                    });
                });
            }
        });