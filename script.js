/* Cambia este número de ejemplo por el WhatsApp oficial de Viacha Conecta. */
const WHATSAPP_VIACHA = "59171981907";
const CLAVE_NEGOCIOS = "viachaConectaNegociosV1";
const imagenPredeterminada = "https://images.unsplash.com/photo-152173 vždy?auto=format&fit=crop&w=700&q=80";

function irA(id, boton){
  const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:"smooth",block:"start"});
  document.querySelectorAll(".side-btn").forEach(b=>b.classList.remove("active"));
  if(boton) boton.classList.add("active");
}
function seleccionarServicio(valor){document.getElementById("servicioContacto").value=valor;}
function leerNegocios(){
  try{return JSON.parse(localStorage.getItem(CLAVE_NEGOCIOS)||"[]")}catch(e){return []}
}
function guardarNegocios(items){localStorage.setItem(CLAVE_NEGOCIOS,JSON.stringify(items))}
function textoSeguro(texto){
  return String(texto||"").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function normalizarNumero(numero){return String(numero||"").replace(/\D/g,"")}
function renderNegocios(){
  const cont=document.getElementById("listaNegocios");
  const buscar=document.getElementById("buscar").value.trim().toLowerCase();
  const categoria=document.getElementById("filtroCategoria").value;
  const todos=leerNegocios();
  const filtrados=todos.filter(n=>{
    const texto=[n.nombre,n.categoria,n.descripcion,n.ubicacion].join(" ").toLowerCase();
    return texto.includes(buscar)&&(!categoria||n.categoria===categoria);
  });
  if(!filtrados.length){
    cont.innerHTML=`<div class="empty"><div style="font-size:42px">🏪</div><h3>${todos.length?"No encontramos resultados":"Todavía no hay negocios publicados"}</h3><p>${todos.length?"Prueba con otra palabra o categoría.":"¡Sé el primero! Pulsa “Subir negocio” y completa el formulario."}</p><button class="btn black" style="margin-top:14px" onclick="irA('publicar')">➕ Publicar un negocio</button></div>`;
    return;
  }
  cont.innerHTML=filtrados.map(n=>{
    const tel=normalizarNumero(n.telefono);
    const enlace=tel?`https://wa.me/${tel}?text=${encodeURIComponent("Hola, vi el negocio "+n.nombre+" en Viacha Conecta y quisiera más información.")}`:"#";
    const foto=n.foto||"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80";
    return `<article class="card">
      <img src="${foto}" alt="Imagen de ${textoSeguro(n.nombre)}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80'">
      <div class="card-body">
        <span class="muted">${textoSeguro(n.categoria)}</span>
        <h3>${textoSeguro(n.nombre)}</h3>
        <p>${textoSeguro(n.descripcion)}</p>
        ${n.precio?`<span class="price">${textoSeguro(n.precio)}</span><br>`:""}
        ${n.ubicacion?`<p style="margin-top:7px">📍 ${textoSeguro(n.ubicacion)}</p>`:""}
        <p style="margin-top:6px">Contacto: ${textoSeguro(n.propietario)}</p>
        <div class="card-actions"><a class="btn green" href="${enlace}" ${tel?'target="_blank" rel="noopener"':''}>💬 Contactar negocio</a><button class="btn-delete" type="button" onclick="borrarNegocio(${Number(n.id)})">🗑️ Borrar publicación</button></div>
      </div></article>`;
  }).join("");
}
// Modo creadora de demostración. Cambia esta clave por una propia.
const CLAVE_CREADORA = "VCadmin2026";
function alternarModoCreadora(){
  if(document.body.classList.contains("creator-mode")){
    document.body.classList.remove("creator-mode");
    document.getElementById("adminToggleText").textContent="Modo creadora";
    document.getElementById("adminStatus").textContent="El botón de borrar está oculto.";
    renderNegocios();
    return;
  }
  const clave = prompt("Introduce la contraseña de la creadora:");
  if(clave === CLAVE_CREADORA){
    document.body.classList.add("creator-mode");
    document.getElementById("adminToggleText").textContent="Cerrar modo creadora";
    document.getElementById("adminStatus").textContent="Modo creadora activo: puedes borrar publicaciones.";
    renderNegocios();
  }else if(clave !== null){
    alert("Contraseña incorrecta.");
  }
}
function borrarNegocio(id){
  if(!document.body.classList.contains("creator-mode")){
    alert("Solo la creadora puede borrar publicaciones. Activa el modo creadora.");
    return;
  }
  if(!confirm("¿Seguro que quieres borrar esta publicación? Esta acción no se puede deshacer.")) return;
  guardarNegocios(leerNegocios().filter(n => Number(n.id) !== Number(id)));
  renderNegocios();
}
document.getElementById("formNegocio").addEventListener("submit",async function(e){
  e.preventDefault();
  const archivo=document.getElementById("fotoNegocio").files[0];
  let foto="";
  if(archivo){
    if(!archivo.type.startsWith("image/")){alert("Selecciona un archivo de imagen.");return;}
    if(archivo.size>900000){alert("La imagen es demasiado grande. Elige una imagen menor de 900 KB para esta demostración.");return;}
    foto=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(archivo)});
  }
  const negocio={
    id:Date.now(),nombre:document.getElementById("nombreNegocio").value.trim(),
    categoria:document.getElementById("categoriaNegocio").value,
    propietario:document.getElementById("propietario").value.trim(),
    telefono:document.getElementById("telefonoNegocio").value.trim(),
    descripcion:document.getElementById("descripcionNegocio").value.trim(),
    ubicacion:document.getElementById("ubicacionNegocio").value.trim(),
    precio:document.getElementById("precioNegocio").value.trim(),foto,fecha:new Date().toISOString()
  };
  try{
    const negocios=leerNegocios(); negocios.unshift(negocio); guardarNegocios(negocios);
    renderNegocios();
    const aviso=document.getElementById("avisoPublicacion");
    aviso.textContent="¡Negocio publicado! Ya aparece en la sección “Negocios publicados” de este navegador.";
    aviso.classList.add("show");
    this.reset();irA("negocios");
  }catch(err){
    alert("No se pudo guardar. Prueba con una imagen más pequeña o elimina algunos negocios guardados.");
  }
});
document.getElementById("buscar").addEventListener("input",renderNegocios);
document.getElementById("filtroCategoria").addEventListener("change",renderNegocios);
document.getElementById("formContacto").addEventListener("submit",function(e){
  e.preventDefault();
  const nombre=document.getElementById("nombreContacto").value.trim();
  const servicio=document.getElementById("servicioContacto").value;
  const mensaje=document.getElementById("mensajeContacto").value.trim();
  const texto=`Hola, Viacha Conecta. Soy ${nombre}. Necesito información sobre: ${servicio}. Mensaje: ${mensaje}`;
  window.open(`https://wa.me/${WHATSAPP_VIACHA}?text=${encodeURIComponent(texto)}`,"_blank","noopener");
});
document.getElementById("year").textContent=new Date().getFullYear();
renderNegocios();