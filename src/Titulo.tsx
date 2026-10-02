function Titulo() {
  const nombre = "Franco";
  if (!nombre) {
    return <h1>no hay nada</h1>;
  }
  return <h1>Hola {nombre}</h1>;
}

export default Titulo;
