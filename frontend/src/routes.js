// Páginas de programas personalizados
import ProgramasPersonalizados from './pages/ProgramasPersonalizados';
import NuevoPrograma from './pages/NuevoPrograma';
import DetalleProgramaPersonalizado from './pages/DetalleProgramaPersonalizado';

const routes = [
  // Rutas para programas personalizados
  {
    path: '/programas-personalizados',
    element: <ProgramasPersonalizados />,
    isPrivate: true
  },
  {
    path: '/programas-personalizados/nuevo',
    element: <NuevoPrograma />,
    isPrivate: true
  },
  {
    path: '/programas-personalizados/:id',
    element: <DetalleProgramaPersonalizado />,
    isPrivate: true
  },
  {
    path: '/programas-personalizados/editar/:id',
    element: <EditarPrograma />,
    isPrivate: true
  },
  {
    path: '/programas-personalizados/:id/compartir',
    element: <CompartirPrograma />,
    isPrivate: true
  },
  {
    path: '/programas-personalizados/:programaId/subprograma/:subprogramaId',
    element: <DetalleSubprograma />,
    isPrivate: true
  },
  {
    path: '/acceso-programa',
    element: <AccesoPrograma />,
    isPrivate: false
  },
]; 