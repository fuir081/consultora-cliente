import { useState } from "react";

import Header from "./header/header";
import Bienvenida from "./panelInicio/bienvenida/bienvenida";
import PendientesDiarios from "./panelInicio/pendientesDiarios/pendientesDiarios";
import TarjetaResumen from "./panelInicio/tarjetaResumen/tarjetaResumen";
import SideBar from "./sideBar/sideBar";

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Header open={open} setOpen={setOpen} />

      <main
        style={{
          width: "100%",
          minHeight: "calc(100vh - 80px)",
          overflow: "hidden",
          background: "rgb(248, 248, 248)",
          display: "flex",
        }}
      >
        <SideBar open={open} />

        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            transition: "all 0.3s ease",
            marginLeft: "5%",
            marginTop: "70px",
            width: "auto",
          }}
        >
          <Bienvenida />
          <PendientesDiarios />
          <TarjetaResumen />
        </div>
      </main>
    </>
  );
}
