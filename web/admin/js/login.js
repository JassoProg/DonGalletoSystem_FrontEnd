function iniciar() {
    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;

    if (usuario === "admin" && contrasena === "1234") {
        alert("Inicio de sesión exitoso!");
        window.location.href = "admin/pagina_principal/pagina_principal.html";
        // Puedes usar window.location.href = "ruta_a_pagina_deseada" para redirigir
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}