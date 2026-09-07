import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { RutaProtegida } from './components/layout/RutaProtegida'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Inventario } from './pages/Inventario'
import { AgregarPerfume } from './pages/AgregarPerfume'
import { CatalogoPerfumes } from './pages/CatalogoPerfumes'
import { DetallePerfume } from './pages/DetallePerfume'
import { NuevaVenta } from './pages/NuevaVenta'
import { DetalleVenta } from './pages/DetalleVenta'
import { RegistrarAbono } from './pages/RegistrarAbono'
import { Ventas } from './pages/Ventas'
import { Clientes } from './pages/Clientes'
import { DetalleCliente } from './pages/DetalleCliente'
import { Ganancias } from './pages/Ganancias'
import { PanelDueno } from './pages/PanelDueno'
import { Asistente } from './pages/Asistente'
import { Mas } from './pages/Mas'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
          <Route path="/inventario" element={<RutaProtegida><Inventario /></RutaProtegida>} />
          <Route path="/inventario/nuevo" element={<RutaProtegida><AgregarPerfume /></RutaProtegida>} />
          <Route path="/inventario/catalogo" element={<RutaProtegida><CatalogoPerfumes /></RutaProtegida>} />
          <Route path="/inventario/:id" element={<RutaProtegida><DetallePerfume /></RutaProtegida>} />
          <Route path="/ventas/nueva" element={<RutaProtegida><NuevaVenta /></RutaProtegida>} />
          <Route path="/ventas/:id/abono" element={<RutaProtegida><RegistrarAbono /></RutaProtegida>} />
          <Route path="/ventas/:id" element={<RutaProtegida><DetalleVenta /></RutaProtegida>} />
          <Route path="/ventas" element={<RutaProtegida><Ventas /></RutaProtegida>} />
          <Route path="/clientes" element={<RutaProtegida><Clientes /></RutaProtegida>} />
          <Route path="/clientes/:id" element={<RutaProtegida><DetalleCliente /></RutaProtegida>} />
          <Route path="/ganancias" element={<RutaProtegida><Ganancias /></RutaProtegida>} />
          <Route path="/panel-dueno" element={<RutaProtegida><PanelDueno /></RutaProtegida>} />
          <Route path="/asistente" element={<RutaProtegida><Asistente /></RutaProtegida>} />
          <Route path="/mas" element={<RutaProtegida><Mas /></RutaProtegida>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
